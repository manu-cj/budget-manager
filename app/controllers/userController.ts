import db from '@/app/lib/db'; 
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'; 
import { User } from '@/app/types/user';

const saltRounds = 10; 

export const createUser = async (user: User): Promise<void> => {
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  db.prepare(`
    INSERT INTO users (id, first_name, last_name, username, email, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, user.first_name, user.last_name, user.username, user.email, hashedPassword);
  
  console.log('Utilisateur ajouté avec succès !');
};


export const authenticateUser = async (username: string, password: string): Promise<boolean> => {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User;
    if (!user) {
      return false;
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  };