import mongoose, { Schema, Document } from "mongoose";

export interface IExpenseCategory extends Document {
  name: string;
}

const ExpenseCategorySchema = new Schema<IExpenseCategory>({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.ExpenseCategory ||
  mongoose.model<IExpenseCategory>("ExpenseCategory", ExpenseCategorySchema);
