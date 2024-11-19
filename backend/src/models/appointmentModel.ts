import mongoose, { Schema, Document } from 'mongoose';
import { Appointment as AppointmentType } from '../types/appointment.type';
import { User as UserType } from '../types/user.type';

// Extend the AppointmentType to include Mongoose's Document
export interface IAppointment extends AppointmentType, Document {}

const userSchema = new Schema<UserType>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^\S+@\S+\.\S+$/.test(value),
      message: 'Invalid email format',
    },
  },
  phone: { type: Number, required: true },
});

const appointmentSchema = new Schema<IAppointment>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  user: { type: userSchema, required: true },
  userConfirmed: { type: Boolean, default: false },
  adminConfirmed: { type: Boolean, default: false },
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
