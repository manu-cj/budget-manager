import Expense from './../models/Expense';
import { v4 as uuidv4 } from 'uuid';
import { IExpense } from './../models/Expense';

// Créer une dépense
export const createExpense = async (expense: IExpense, userId: string): Promise<void> => {
  try {
    const id = uuidv4();  // Générer un ID unique
    const newExpense = new Expense({
      id,
      amount: expense.amount,
      description: expense.description,
      date: expense.date,
      user_id: userId,
      category_id: expense.category_id,
    });

    await newExpense.save();  // Sauvegarder dans la base de données
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la dépense :', error);
    throw new Error('Erreur lors de l\'ajout de la dépense');
  }
};

// Récupérer toutes les dépenses d'un utilisateur
export const getExpenses = async (userId: string): Promise<IExpense[]> => {
  try {
    const expenses = await Expense.find({ user_id: userId })
      .sort({ date: -1 })  // Trier par date décroissante
      .exec();

    return expenses;
  } catch (error) {
    console.error('Erreur lors de la récupération des dépenses :', error);
    throw new Error('Erreur lors de la récupération des dépenses');
  }
};

// Récupérer les dépenses avec pagination
export const getExpensesByOffset = async (
  userId: string,
  limit: number,
  offset: number
): Promise<IExpense[]> => {
  try {
    const expenses = await Expense.find({ user_id: userId })
      .sort({ date: -1 })
      .skip(offset)  // Skip les dépenses jusqu'à l'offset
      .limit(limit)  // Limiter les résultats
      .exec();

    return expenses;
  } catch (error) {
    console.error('Erreur lors de la récupération des dépenses :', error);
    throw new Error('Erreur lors de la récupération des dépenses');
  }
};

// Supprimer une dépense
export const deleteExpense = async (expenseId: string, userId: string): Promise<void> => {
  try {
    const result = await Expense.deleteOne({ _id: expenseId, user_id: userId });

    if (result.deletedCount === 0) {
      throw new Error('Aucune dépense trouvée ou dépense non autorisée');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la dépense :', error);
    throw new Error('Erreur lors de la suppression de la dépense');
  }
};
