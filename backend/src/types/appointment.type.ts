import { User } from "./user.type";
import { Item } from "./item.type"
export interface Appointment {
    vs: Number;
    startDate: Date;
    endDate: Date;
    user: User;
    items: Item[];
    confirmed: boolean;
    price: number;
    createdAt?: Date; 
    updatedAt?: Date;
}
