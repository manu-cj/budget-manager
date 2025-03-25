

import Revenue from "../models/Revenue";
import { IRevenue } from "../models/Revenue";

export const createRevenue = async (revenue: IRevenue, userId: string) => {
  try {
    const newRevenue = new Revenue({
      amount: revenue.amount,
      description: revenue.description,
      date: revenue.date,
      user_id: userId,
      category_id: revenue.category_id,
    });
    await newRevenue.save();
  } catch (error) {
    console.error("Erreur lors de l'ajout du revenu :", error);
    throw error;
  }
};

export const getRevenues = async (userId: string) => {
  try {
    return await Revenue.find({ user_id: userId });
  } catch (error) {
    console.error("Erreur lors de la récupération des revenus :", error);
    throw error;
  }
};

export const getRevenuesByOffset = async (userId: string, limit: number, offset: number) => {
  try {
    return await Revenue.find({ user_id: userId })
      .sort({ date: -1 })
      .limit(limit)
      .skip(offset);
  } catch (error) {
    console.error("Erreur lors de la récupération des revenus :", error);
    throw error;
  }
};

export const deleteRevenue = async (revenueId: string, userId: string) => {
  try {
    const result = await Revenue.findOneAndDelete({ _id: revenueId, user_id: userId });
    if (result.deletedCount === 0) {
      throw new Error("Le revenu n'a pas été trouvé ou vous n'êtes pas autorisé à le supprimer");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du revenu :", error);
    throw error;
  }
};