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
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },  // Manually add createdAt field
}, { versionKey: false });

// Add TTL index based on `endDate` field, expire 14 days after `endDate`
appointmentSchema.index({ endDate: 1 }, { expireAfterSeconds: 1209600 });  // 14 days in seconds

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
