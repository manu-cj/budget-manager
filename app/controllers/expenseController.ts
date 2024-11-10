import db from '@/app/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from '@/app/types/expense';

export const createExpense = async (expense: Expense, userId: string): Promise<void> => {
  try {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO expenses (id, amount, description, date, user_id, category_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, expense.amount, expense.description, expense.date, userId, expense.category_id);
    console.log('Dépense ajoutée avec succès !');
    console.log(`id : ${id}, expense.amount : ${expense.amount}, expense.description :${expense.description}, expense.date :${expense.date}, userId :${userId}, expense.category_id : ${expense.category_id}`);
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la dépense :', error);
    throw error;
  }
};


export const getExpenses = async (userId: string): Promise<Expense[]> => {
  try {
    const expenses = db.prepare(`
      SELECT * FROM expenses WHERE user_id = ?
    `).all(userId)as Expense[];
    console.log("Résultat de la requête : ", expenses, " Pour l'user ", userId);
    return expenses;
  } catch (error) {
    console.error('Erreur lors de la récupération des dépenses :', error);
    throw error;
  }
};
