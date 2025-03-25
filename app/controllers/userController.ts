// import db from './../lib/db'; 
// import { v4 as uuidv4 } from 'uuid';
// import bcrypt from 'bcrypt'; 
// import { User } from './../types/user';

// const saltRounds = 10; 

import Users from '../models/Users';
import Budget from './../models/Budget';
import bcrypt from 'bcrypt';
import { IUser } from '../models/Users';

const saltRounds = 10;

export const createUser = async (user: IUser): Promise<void> => {

  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  try {
    // Création de l'utilisateur dans MongoDB
    const newUser = new Users({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });
    await newUser.save();

    console.log('Utilisateur ajouté avec succès !');

    // Création du budget par défaut pour l'utilisateur
    const newBudget = new Budget({
      user_id: newUser._id, // Associe l'utilisateur créé au budget
    });
    await newBudget.save();

    console.log('Budget par défaut créé avec succès !');
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur et du budget:', error);
    throw error;
  }
};



export const authenticateUser = async (email: string, password: string): Promise<boolean> => {
  const user = await Users.findOne({ email });

  if (!user) {
    return false;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};


export async function getUserByEmail(email: string): Promise<IUser | null> {
  try {
    const user = await Users.findOne({ email }).select('id email username'); // Sélectionne uniquement ces champs

    return user ? user as IUser : null;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur :', error);
    throw new Error("Erreur lors de la récupération des informations utilisateur");
  }
}



export async function changePassword(id: string, newPassword: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  try {
    await Users.updateOne({ _id: id }, { $set: { password: hashedPassword } });
    console.log('Mot de passe mis à jour avec succès !');
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe :', error);
    throw new Error('Erreur lors du changement de mot de passe');
  }
}



export async function changePasswordWithMail(mail: string, newPassword: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  try {
    await Users.updateOne({ email: mail }, { $set: { password: hashedPassword } });
    console.log('Mot de passe mis à jour avec succès !');
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe avec l\'email :', error);
    throw new Error('Erreur lors du changement de mot de passe avec l\'email');
  }
}


export async function verifyPassword(id: string, password: string): Promise<boolean> {
  try {
    const user = await Users.findById(id);

    if (!user) {
      return false;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe :', error);
    throw new Error('Erreur lors de la vérification du mot de passe');
  }
}
