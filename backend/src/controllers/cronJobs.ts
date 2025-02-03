import cron from 'node-cron';
import mongoose from 'mongoose';
import Appointment from '../models/appointmentModel'; // Adjust the path to your model
import sendEmail from '../utils/sendMail'; // Adjust the path to your sendEmail module

// Cron job to delete appointments that are older than 2 days and not confirmed
cron.schedule('*/1 * * * *', async () => {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago in ms

  try {
    // Find all appointments where confirmed is false and createdAt is older than 2 days
    const appointmentsToDelete = await Appointment.find({
      confirmed: false,
      createdAt: { $lt: twoDaysAgo },
    });

    if (appointmentsToDelete.length > 0) {
      // Iterate over appointments to delete
      for (const appointment of appointmentsToDelete) {
        console.log('Deleting appointment:', appointment);

        // Send email notification to the user
        try {
          await sendEmail(
            appointment.email, // Assuming the appointment model has an email field
            'Tvoje vypůjčka byla stornována',
            `Dobrý den ${appointment.user.name} vaše vypůjčka na den ${appointment.date} byla stornována z důvodu nezaplacení v uvedeném čase.`,
            `<h3>Dobrý den ${appointment.user.name}</h3>
             <p>vaše vypůjčka na den ${appointment.date} byla stornována z důvodu nezaplacení v uvedeném čase.</p>`,
          );
          console.log(`Email sent to ${appointment.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${appointment.email}:`, emailError);
        }
      }

      // Delete appointments
      await Appointment.deleteMany({
        _id: { $in: appointmentsToDelete.map((a) => a._id) },
      });
      console.log(`${appointmentsToDelete.length} old appointments deleted.`);
    }
  } catch (err) {
    console.error('Error in cron job:', err);
  }
});
