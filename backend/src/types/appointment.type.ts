import { User } from "./user.type";

export interface Appointment {
    startDate: Date;
    endDate: Date;
    user: User;
    userConfirmed: boolean;
    price: number;
}