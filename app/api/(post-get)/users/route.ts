import { NextResponse } from 'next/server';
import { User } from '@/app/types/user';
import { createUser } from './../../../controllers/userController';
import { createDefaultBudget } from './../../../controllers/budgetController'
import { validateUser } from './../../../validators/userValidator';
import { sendMail } from './../../../lib/sendMail';

export async function POST(request: Request) {
  const { user, passwordRepeat }: { user: User; passwordRepeat: string } = await request.json();

  const validationError = validateUser(user, passwordRepeat);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  await createUser(user);
  await createDefaultBudget(user.id);
  await sendMail(user.email, 'Bienvenue sur Lubu', `
    <p>Bonjour ${user.username},</p>
    <p>Votre compte Lubu a été créé avec succès.</p>
    <p>Vous pouvez maintenant vous connecter à votre compte en utilisant votre adresse email et votre mot de passe.</p>
    <p>Si vous avez des questions ou des problèmes, n'hésitez pas à nous contacter.</p>
    <p>Merci,</p>
  `);
  return NextResponse.json({ message: 'Utilisateur créé avec succès.' });
}




