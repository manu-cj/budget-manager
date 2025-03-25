import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  amount: number;
  description: string;
  date: Date;
  user_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId | null;
}

const ExpenseSchema = new Schema<IExpense>({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  category_id: { type: Schema.Types.ObjectId, ref: "ExpenseCategory", default: null },
});

export default mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);
