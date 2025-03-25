import mongoose, { Schema, Document } from "mongoose";

export interface IRevenueCategory extends Document {
  name: string;
}

const RevenueCategorySchema = new Schema<IRevenueCategory>({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.RevenueCategory ||
  mongoose.model<IRevenueCategory>("RevenueCategory", RevenueCategorySchema);
