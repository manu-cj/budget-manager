import db from '@/app/lib/db'; 
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'; 
import { User } from '@/app/types/user';

const saltRounds = 10; 

export const createUser = async (user: User): Promise<void> => {
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  // Ajoutez des logs pour déboguer
  console.log('Données de l\'utilisateur:', user);
  console.log('ID généré:', id);
  console.log('Mot de passe haché:', hashedPassword);
  console.log("Type de hashedPassword :", typeof hashedPassword);

  try {
    db.prepare(`
      INSERT INTO users (id, first_name, last_name, username, email, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, user.first_name, user.last_name, user.username, user.email, hashedPassword);

    console.log('Utilisateur ajouté avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion de l\'utilisateur:', error);
    throw error; // Relancez l'erreur pour que le contrôleur puisse la gérer
  }
};


export const authenticateUser = async (username: string, password: string): Promise<boolean> => {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User;
    if (!user) {
      return false;
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  };