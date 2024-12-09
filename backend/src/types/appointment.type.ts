import { User } from "./user.type";

export interface Appointment {
    vs: Number;
    startDate: Date;
    endDate: Date;
    user: User;
    confirmed: boolean;
    price: number;
    createdAt?: Date; 
    updatedAt?: Date;
}
