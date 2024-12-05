// appointmentController.ts

import { Request, Response, NextFunction } from 'express';
import Appointment from '../models/appointmentModel';

export const confirmAppointment = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.confirmed) {
      return res.status(400).json({ message: 'Appointment already confirmed' });
    }

    // Confirm the appointment
    appointment.confirmed = true;
    await appointment.save();

    res.status(200).json({
      message: 'Appointment confirmed successfully',
      appointment: appointment,
    });
  } catch (error) {
    next(error); // Pass errors to the next middleware (error handler)
  }
};
