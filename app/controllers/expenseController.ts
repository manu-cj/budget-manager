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
    return expenses;
  } catch (error) {
    console.error('Erreur lors de la récupération des dépenses :', error);
    throw error;
  }
};
