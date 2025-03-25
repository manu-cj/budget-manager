import mongoose, { Schema, Document } from "mongoose";

export interface IRevenue extends Document {
  amount: number;
  description: string;
  date: Date;
  user_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId | null;
}

const RevenueSchema = new Schema<IRevenue>({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  category_id: { type: Schema.Types.ObjectId, ref: "RevenueCategory", default: null },
});

export default mongoose.models.Revenue || mongoose.model<IRevenue>("Revenue", RevenueSchema);
