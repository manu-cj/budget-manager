import db from './../lib/db'; 
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'; 
import { User } from './../types/user';

const saltRounds = 10; 

export const createUser = async (user: User): Promise<void> => {
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  // Ajoutez des logs pour déboguer
  console.log('Données de l\'utilisateur:', user);
  console.log('ID généré:', id);
  console.log('Mot de passe haché:', hashedPassword);
  console.log("Type de hashedPassword :", typeof hashedPassword);

  // Transaction pour garantir la cohérence des données
  const transaction = db.transaction(() => {
    try {
      // Insérer l'utilisateur dans la table users
      db.prepare(`
        INSERT INTO users (id, first_name, last_name, username, email, password)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, user.first_name, user.last_name, user.username, user.email, hashedPassword);

      console.log('Utilisateur ajouté avec succès !');

      // Insérer un budget par défaut pour cet utilisateur dans la table budgets
      db.prepare(`
        INSERT INTO budgets (id) VALUES (?)
      `).run(id);

      console.log('Budget par défaut créé avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur et du budget:', error);
      throw error;  // Relancez l'erreur pour gérer la transaction
    }
  });

  // Lancer la transaction
  try {
    transaction();
    console.log('Utilisateur et budget créés avec succès !');
  } catch (error) {
    console.error('Erreur dans la transaction:', error);
    throw error;
  }
};


export const authenticateUser = async (email: string, password: string): Promise<boolean> => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User;
    if (!user) {
      return false;
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  };

  export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const user = db.prepare(`
            SELECT id, email, username
            FROM users
            WHERE email = ?
        `).get(email);

        return user ? user as User : null;
    } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
        throw new Error("Erreur lors de la récupération des informations utilisateur");
    }
}


export async function changePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    db.prepare(`
        UPDATE users
        SET password = ?
        WHERE id = ?
    `).run(hashedPassword, id);
}


export async function changePasswordWithMail(mail: string, newPassword: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  db.prepare(`
      UPDATE users
      SET password = ?
      WHERE email = ?
  `).run(hashedPassword, mail);
}

export async function verifyPassword(id: string, password: string): Promise<boolean> {
  try {
    const user = db.prepare(`
      SELECT password
      FROM users
      WHERE id = ?
    `).get(id) as User;

    if (!user) {
      return false;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe :', error);
    throw new Error("Erreur lors de la vérification du mot de passe");
  }
}