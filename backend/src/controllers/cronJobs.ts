import cron from 'node-cron';
import mongoose from 'mongoose';
import Appointment from '../models/appointmentModel'; // Adjust the path to your model

// Cron job to delete appointments that are older than 2 days and not confirmed
cron.schedule('*/1 * * * *', async () => {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago in ms

  try {
    // Find all appointments where userConfirmed is false and createdAt is older than 2 days
    const appointmentsToDelete = await Appointment.find({
      confirmed: false,
      createdAt: { $lt: twoDaysAgo }
    });

    if (appointmentsToDelete.length > 0) {
      // Delete appointments
      await Appointment.deleteMany({
        _id: { $in: appointmentsToDelete.map(a => a._id) }
      });
      console.log(`${appointmentsToDelete.length} old appointments deleted.`);
    }
  } catch (err) {
    console.error('Error in cron job:', err);
  }
});
