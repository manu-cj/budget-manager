import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  user_id: mongoose.Types.ObjectId;
  housing: number;
  food: number;
  transportation: number;
  health: number;
  leisure: number;
  subscriptions: number;
  insurance: number;
  education: number;
  repayments: number;
  savings: number;
  animals: number;
  gifts_and_events: number;
  miscellaneous: number;
  vacation: number;
  created_at?: Date;
  updated_at?: Date;
}

const BudgetSchema = new Schema<IBudget>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  housing: { type: Number, default: 800.0 },
  food: { type: Number, default: 300.0 },
  transportation: { type: Number, default: 150.0 },
  health: { type: Number, default: 100.0 },
  leisure: { type: Number, default: 100.0 },
  subscriptions: { type: Number, default: 200.0 },
  insurance: { type: Number, default: 75.0 },
  education: { type: Number, default: 50.0 },
  repayments: { type: Number, default: 50.0 },
  savings: { type: Number, default: 100.0 },
  animals: { type: Number, default: 50.0 },
  gifts_and_events: { type: Number, default: 50.0 },
  miscellaneous: { type: Number, default: 25.0 },
  vacation: { type: Number, default: 50.0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema);
