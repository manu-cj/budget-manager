import { NextResponse } from 'next/server';
import Users from './../../../models/Users';
import Budget from './../../../models/Budget';
import { sendMail } from './../../../lib/sendMail';// Assurez-vous d'avoir une fonction sendMail pour l'envoi d'emails
import { IUser } from './../../../models/Users'; 
import bcrypt from 'bcrypt';
import { connectToDatabase } from './../../../lib/DbConnect';

// Fonction de validation pour l'utilisateur (à adapter selon tes règles)
const validateUser: (user: IUser, passwordRepeat: string) => string | null = (user: IUser, passwordRepeat: string): string | null => {
  if (user.password !== passwordRepeat) {
    return 'Les mots de passe ne correspondent pas.';
  }

  if (!user.email || !user.password || !user.username) {
    return 'Tous les champs doivent être remplis.';
  }

  // Ajoutez d'autres validations nécessaires (ex: format email, etc.)
  
  return null;
};

export async function POST(request: Request) {
  const { user, passwordRepeat }: { user: IUser; passwordRepeat: string } = await request.json();

  // Validation de l'utilisateur
  const validationError = validateUser(user, passwordRepeat);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    await connectToDatabase();
    // Hachage du mot de passe avant de sauvegarder l'utilisateur
    const hashedPassword = await bcrypt.hash(user.password, 10);
    // Vérification si l'utilisateur existe déjà
    const existingUserByEmail = await Users.findOne({ email: user.email });
    if (existingUserByEmail) {
      return NextResponse.json({ error: 'Un utilisateur avec cet email existe déjà.' }, { status: 400 });
    }

    const existingUserByUsername = await Users.findOne({ username: user.username });
    if (existingUserByUsername) {
      return NextResponse.json({ error: 'Un utilisateur avec ce nom d\'utilisateur existe déjà.' }, { status: 400 });
    }
    // Création de l'utilisateur dans la base de données
    const newUser = new Users({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });
    await newUser.save();

    // Création du budget par défaut pour l'utilisateur
    const newBudget = new Budget({
      user_id: newUser._id,
    });
    await newBudget.save();

    // Envoi de l'email de bienvenue
    await sendMail(user.email, 'Bienvenue sur Lubu', `
      <p>Bonjour ${user.username},</p>
      <p>Votre compte Lubu a été créé avec succès.</p>
      <p>Vous pouvez maintenant vous connecter à votre compte en utilisant votre adresse email et votre mot de passe.</p>
      <p>Si vous avez des questions ou des problèmes, n'hésitez pas à nous contacter.</p>
      <p>Merci,</p>
    `);

    // Réponse à l'utilisateur indiquant que l'inscription a été réussie
    return NextResponse.json({ message: 'Utilisateur créé avec succès.', success: true });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur ou du budget:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de l\'utilisateur.' }, { status: 500 });
  }
}
