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
