import mongoose, { Schema, Document } from 'mongoose';
import { Appointment as AppointmentType } from '../types/appointment.type';
import { User as UserType } from '../types/user.type';

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
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

// Add TTL index based on `endDate` field, expire 14 days after `endDate`
appointmentSchema.index({ endDate: 1 }, { expireAfterSeconds: 1209600 }); // 14 days in seconds

// Pre-save hook to check if userConfirmed is false and it's older than 2 days
appointmentSchema.pre('save', async function (next) {
  if (!this.userConfirmed) {
    const now = new Date();
    
    // Ensure createdAt is defined
    const createdAt = this.createdAt ? new Date(this.createdAt) : now;

    const timeDiff = now.getTime() - createdAt.getTime();
    const twoDaysInMs = 60;

    // If more than 2 days have passed and userConfirmed is false, delete this appointment
    if (timeDiff > twoDaysInMs) {
      // Use the model directly to call deleteOne
      const Appointment = mongoose.model<IAppointment>('Appointment');
      await Appointment.deleteOne({ _id: this._id }); // Delete the document
    }
  }
  next();
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
