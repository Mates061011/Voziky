import express, { Request, Response, NextFunction } from 'express';
import Appointment, { IAppointment } from '../models/appointmentModel';
import sendEmail from '../utils/sendMail';
import dayjs from 'dayjs';
import verifyToken from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Create Appointment
const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { startDate, endDate, user } = req.body;

  try {
    // Ensure that startDate and endDate are in ISO 8601 format
    const parsedStartDate = dayjs(startDate).toISOString();
    const parsedEndDate = dayjs(endDate).toISOString();

    const overlappingAppointments = await Appointment.find({
      startDate: { $lt: parsedEndDate },
      endDate: { $gt: parsedStartDate },
    });

    if (overlappingAppointments.length > 0) {
      res.status(400).json({
        message: 'V tomto čase už bohužel má vozík vypůjčený někdo jiný.',
      });
      return;
    }

    const start = dayjs(parsedStartDate);
    const end = dayjs(parsedEndDate);
    const selectedDaysCount = end.diff(start, 'day') + 1;

    let price = 0;
    if (selectedDaysCount === 1) {
      price = 300;
    } else if (selectedDaysCount > 1) {
      price = selectedDaysCount * 250;
    }

    const appointment: IAppointment = new Appointment({
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      user,
      confirmed: false,
      price,
    });

    const savedAppointment = await appointment.save();
    const paymentData = `SPD*1.0*ACC:CZ0806000000000242829671*AM:${savedAppointment.price.toFixed(2)}*CC:CZK*X-VS:${savedAppointment.vs}*MSG:${savedAppointment.user.name} ${savedAppointment.user.surname}`;
    const userDetails = {
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      price: appointment.price
    }
    await sendEmail(
      user.email,
      'Potvrzení vypůjčky',
      `Please confirm your appointment by clicking this link: ${process.env.BASE_URL}/api/appointment/confirm/${savedAppointment._id}`,
      userDetails,
      paymentData
    );

    res.status(201).json(savedAppointment);
  } catch (error) {
    next(error);
  }
};

// Confirm Appointment
const confirmAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    appointment.confirmed = true;
    await appointment.save();

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center;">
          <h2 style="color: #28a745;">Potvrzeno!</h2>
          <p style="font-size: 16px;">Tvoje vypůjčka na ${dayjs(appointment.startDate).format('DD.MM.YYYY HH:mm')} byla potvrzena.</p>
          <p>Pokud se jedná o chybu nebo jste si vypůjčku nenaplánovali, ihned nás prosím kontaktujte.</p>
        </body>
      </html>
    `);

    const appointmentDetails = `
      Appointment Details:
      - Start Date: ${appointment.startDate}
      - End Date: ${appointment.endDate}
      - User: ${appointment.user.name} ${appointment.user.surname}
      - User Email: ${appointment.user.email}
      - User Phone: ${appointment.user.phone}
      - Price: ${appointment.price}
    `;

    await sendEmail(
      "vozikybackend@gmail.com",
      'Vypůjčka potvrzena!',
      `Uživatel potvrdil zapůjčku, zde jsou detaily:\n\n${appointmentDetails}`
    );

  } catch (error) {
    next(error);
  }
};

// Get Appointments for Current and Next Month
const getAppointmentsWithOptionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentDate = dayjs();
    const startOfCurrentMonth = currentDate.startOf('month').toDate();
    const endOfNextMonth = currentDate.add(1, 'month').endOf('month').toDate();

    const token = req.headers['authorization']?.split(' ')[1];
    let appointments;

    if (token) {
      try {
        // Verify token
        jwt.verify(token, process.env.JWT_SECRET!);
        // If token is valid, return full details
        appointments = await Appointment.find({
          startDate: {
            $gte: startOfCurrentMonth,
            $lt: endOfNextMonth,
          },
        });
      } catch (error) {
        // If token is invalid, fallback to partial data
        appointments = await Appointment.find({
          startDate: {
            $gte: startOfCurrentMonth,
            $lt: endOfNextMonth,
          },
        }).select('startDate endDate userConfirmed');
      }
    } else {
      // If no token is provided, return partial data
      appointments = await Appointment.find({
        startDate: {
          $gte: startOfCurrentMonth,
          $lt: endOfNextMonth,
        },
      }).select('startDate endDate userConfirmed');
    }

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// Route for creating an appointment
router.post('/', createAppointment);

// Route for confirming an appointment
router.get('/confirm/:id', verifyToken, confirmAppointment);

// Route for getting appointments from the current and next month
router.get('/', getAppointmentsWithOptionalAuth);

export default router;
