import { User } from "./user.type";
import mongoose from "mongoose";

export interface Appointment {
    vs: number;
    startDate: Date;
    endDate: Date;
    user: User;
    items: mongoose.Types.ObjectId[];
    confirmed: boolean;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}
