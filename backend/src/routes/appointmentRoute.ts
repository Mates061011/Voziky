import express, { Request, Response, NextFunction } from 'express';
import Appointment, { IAppointment } from '../models/appointmentModel';
import sendEmail from '../utils/sendMail';

const router = express.Router();

// Create an appointment handler
const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { startDate, endDate, user } = req.body;

  try {
    // Check if the new appointment overlaps with any existing appointments
    const overlappingAppointments = await Appointment.find({
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      ],
    });

    if (overlappingAppointments.length > 0) {
      res.status(400).json({
        message: 'V tomto čase už bohužel má vozík vypůjčený někdo jiný.',
      });
      return; // exit early after sending the response
    }

    // Create new appointment and set default values for userConfirmed and adminConfirmed
    const appointment: IAppointment = new Appointment({
      startDate,
      endDate,
      user,
      userConfirmed: false, // default value
      adminConfirmed: false, // default value
    });

    const savedAppointment = await appointment.save();

    // Send confirmation email to the user
    await sendEmail(
      user.email,
      'Potvrzení vypůjčky',
      `Please confirm your appointment by clicking this link: ${process.env.BASE_URL}/api/appointment/confirm/${savedAppointment._id}`
    );

    res.status(201).json(savedAppointment); // Return the created appointment in the response
  } catch (error) {
    next(error); // Pass error to the next error handler
  }
};
// Define the confirmAppointment handler
const confirmAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Attempt to find the appointment by ID
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({ message: 'Žádná taková vypůjčka neexistuje' });
      return; // Exit the function early as we already sent the response
    }

    // Update the appointment confirmation status
    appointment.userConfirmed = true;
    await appointment.save();

    // Set Content-Type to text/html to indicate we're sending HTML
    res.setHeader('Content-Type', 'text/html');

    // Send HTML response
    res.status(200).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center;">
          <h2 style="color: #28a745;">Potvrzeno!</h2>
          <p style="font-size: 16px;">Tvoje vypůjčka na ${appointment.startDate.toLocaleString()} byla potvrzena.</p>
          <p>Pokud se jedná o chybu nebo jste si vypůjčku nenaplánovali, ihned nás prosím kontaktujte.</p>
        </body>
      </html>
    `);

    // Prepare appointment information for the email
    const appointmentDetails = `
      Appointment Details:
      - Start Date: ${appointment.startDate}
      - End Date: ${appointment.endDate}
      - User: ${appointment.user.name} ${appointment.user.surname}
      - User Email: ${appointment.user.email}
      - User Phone: ${appointment.user.phone}
    `;

    // Send confirmation email to the admin with appointment details
    await sendEmail(
      "vozikybackend@gmail.com",  // Admin's email
      'Vypůjčka potvrzena!',     // Email subject
      `Uživatel potvrdil zapůjčku, zde jsou detaily:\n\n${appointmentDetails}`  // Email body with appointment info
    );
    
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
};
const getAppointmentsForCurrentAndNextMonth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentDate = new Date();
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

    // Get start and end of the next month
    const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const endOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0, 23, 59, 59, 999);

    // Find appointments that are within the current and next month range
    const appointments = await Appointment.find({
      startDate: {
        $gte: startOfCurrentMonth, // appointments starting after or on the first day of the current month
        $lt: endOfNextMonth, // appointments ending before the last day of the next month
      },
    }).select('startDate endDate userConfirmed'); // Only select the required fields

    res.status(200).json(appointments); // Return filtered appointments
  } catch (error) {
    next(error); // Pass any errors to the next error handler
  }
};
// Route for creating an appointment
router.post('/', createAppointment);
// Route for confirming an appointment
router.get('/confirm/:id', confirmAppointment);
// Route to get all appointments from this month and next month
router.get('/', getAppointmentsForCurrentAndNextMonth);
export default router;
