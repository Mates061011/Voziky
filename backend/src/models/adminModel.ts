// src/models/userModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types/admin.type';

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
