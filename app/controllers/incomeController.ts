import db from "@/app/lib/db";
import { v4 as uuidv4 } from "uuid";
import { Revenue } from "../types/revenue";

export const createRevenue = async ( revenue: Revenue, userId: string ): Promise<void> => {
  try {
    const id = uuidv4();
    db.prepare(
        `INSERT INTO revenues (id, amount, description, date, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?)`
    ).run( id, revenue.amount, revenue.description, revenue.date, userId, revenue.category_id );
  } catch (error) {
    console.error("Erreur lors de l'ajout de la dépense :", error);
    throw error;
  }
};

export const getRevenues = async (userId: string): Promise<Revenue[]> => {
  try {
    const revenues = db
      .prepare(
        `SELECT * FROM revenues WHERE user_id = ?`
      ).all(userId) as Revenue[];
    return revenues;
  } catch (error) {
    console.error("Erreur lors de la récupération des dépenses :", error);
    throw error;
  }
};

export const getRevenuesByOffset = async (
  userId: string,
  limit: number,  
  offset: number   
): Promise<Revenue[]> => {
  try {
    const revenues = db.prepare(`
      SELECT * FROM revenues 
      WHERE user_id = ?
      ORDER BY DATE(date) DESC 
      LIMIT ? OFFSET ?
    `).all(userId, limit, offset) as Revenue[];
    return revenues;
  } catch (error) {
    console.error('Erreur lors de la récupération des revenues :', error);
    throw error;
  }
};

export const deleteRevenue = async (revenueId: string, userId: string): Promise<void> => {
  try {
    db.prepare(`
      DELETE FROM revenues WHERE id = ? AND user_id = ?
    `).run(revenueId, userId);
  } catch (error) {
    console.error('Erreur lors de la suppression de la dépense :', error);
    throw error;
  }
};