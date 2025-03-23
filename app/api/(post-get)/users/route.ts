import { NextResponse } from 'next/server';
import { User } from '@/app/types/user';
import { createUser } from '@/app/controllers/userController';
import { createDefaultBudget } from '@/app/controllers/budgetController'
import { validateUser } from '@/app/validators/userValidator';

export async function POST(request: Request) {
  const { user, passwordRepeat }: { user: User; passwordRepeat: string } = await request.json();

  const validationError = validateUser(user, passwordRepeat);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  await createUser(user);
  await createDefaultBudget(user.id);
  return NextResponse.json({ message: 'Utilisateur créé avec succès.' });
}



