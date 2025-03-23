import db from './../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from './../types/expense';

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
      SELECT * FROM expenses WHERE user_id = ? ORDER BY DATE(date) DESC 
    `).all(userId)as Expense[];
    return expenses;
  } catch (error) {
    console.error('Erreur lors de la récupération des dépenses :', error);
    throw error;
  }
};

export const getExpensesByOffset = async (
  userId: string,
  limit: number,  
  offset: number   
): Promise<Expense[]> => {
  try {
    const expenses = db.prepare(`
      SELECT * FROM expenses 
      WHERE user_id = ?
      ORDER BY DATE(date) DESC 
      LIMIT ? OFFSET ? 
    `).all(userId, limit, offset) as Expense[];
    return expenses;
  } catch (error) {
    console.error('Erreur lors de la récupération des dépenses :', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId: string, userId: string): Promise<void> => {
  try {
    console.log("expenseId : " + expenseId +" userId : "+ userId);
    
    db.prepare(`
      DELETE FROM expenses WHERE id = ? AND user_id = ?
    `).run(expenseId, userId);
  } catch (error) {
    console.error('Erreur lors de la suppression de la dépense :', error);
    throw error;
  }
};
