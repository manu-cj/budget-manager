import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Vérifie si le modèle existe déjà avant de le redéfinir
const Users = mongoose.models.Users || mongoose.model<IUser>('Users', UserSchema);

export default Users;
