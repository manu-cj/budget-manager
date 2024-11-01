import db from '@/app/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from '@/app/types/expense';

export const createExpense = async (expense: Expense): Promise<void> => {
  const id = uuidv4(); 
  db.prepare(`
    INSERT INTO expenses (id, amount, description, date, user_id, category_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, expense.amount, expense.description, expense.date, expense.user_id, expense.category_id);
  console.log('Dépense ajoutée avec succès !');
};

