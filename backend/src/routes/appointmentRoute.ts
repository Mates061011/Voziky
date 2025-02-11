import express, { Request, Response, NextFunction } from 'express';
import Appointment, { IAppointment } from '../models/appointmentModel';
import sendEmail from '../utils/sendMail';
import verifyToken from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';
const router = express.Router();
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Item } from '../models/itemModel'; 

// Extend dayjs with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);
const formatDateInCzech = (date: string | Date): string => {
  const utcDate = new Date(date);
  const formatter = new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC', // Force UTC
  });
  return formatter.format(utcDate);
};

   

// Create Appointment
const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { startDate, endDate, user, items } = req.body;

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

    // Validate items exist in the database
    const invalidItems = [];
    for (const itemId of items) {
      const item = await Item.findById(itemId); // Assuming "Item" is the model for items in the database
      if (!item) {
        invalidItems.push(itemId);
      }
    }

    if (invalidItems.length > 0) {
      res.status(400).json({
        message: `Následující položky neexistují v databázi: ${invalidItems.join(', ')}`,
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

    const appointment = new Appointment({
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      user,
      items,
      confirmed: false,
      price,
    });

    const savedAppointment = await appointment.save();
    const paymentData = `SPD*1.0*ACC:CZ0806000000000242829671*AM:${savedAppointment.price.toFixed(2)}*CC:CZK*X-VS:${savedAppointment.vs}*MSG:${savedAppointment.user.name} ${savedAppointment.user.surname}`;

    const userDetails = {
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      price: appointment.price,
    };

    // HTML content for the email
    const htmlContent = `
    <html>
        <head>
          <title>Informace o objednávce</title>
        </head>
        <body>
          <div style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
            <div style="width: 600px; background-color: #768078; padding: 20px; border-radius: 20px; color: white; font-family: Arial, sans-serif;">
              <h1 style="margin: 0 0 20px 0;">Informace o vaší objednávce:</h1>
              ${userDetails ? `
              <div>
                <p style="margin: 0 0 10px 0; color: rgb(209, 209, 209);">
                  Datum a čas vyzvednutí:&nbsp;<strong style="color: white;">
                    ${formatDateInCzech(userDetails.startDate)} - ${formatDateInCzech(userDetails.endDate)}
                  </strong>
                </p>
                <p style="margin: 0 0 20px 0; color: rgb(209, 209, 209);">
                  Celková cena:&nbsp;<strong style="color: white;">${userDetails.price}kč</strong>
                </p>
              </div>
              ` : ''}
              <div style="margin: 20px 0;">
                <p style="margin: 5px 0; font-weight: bold; color: white;">Zaplatte zálohu 100kč pro potvrzení objednávky</p>
                <img src="cid:qrcode" alt="qrcode" style="border-radius: 10px; width: 30%; margin: 5px 0;">
                <p style="margin: 5px 0; color: rgb(209, 209, 209);">
                  Číslo účtu:&nbsp;<strong style="color: white;">Neuvedeno</strong>
                </p>
                <p style="margin: 5px 0; color: rgb(209, 209, 209);">
                  Variabilní symbol:&nbsp;<strong style="color: white;">${savedAppointment.vs}</strong>
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email with the HTML content
    await sendEmail(
      user.email,
      'Potvrzení vypůjčky',
      `Please confirm your appointment by clicking this link: ${process.env.BASE_URL}/api/appointment/confirm/${savedAppointment._id}`,
      htmlContent,
      {
        variableSymbol: savedAppointment.vs,
        paymentInfo: paymentData,
      }
    );

    res.status(201).json(savedAppointment);
  } catch (error) {
    next(error);
  }
};



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

    // Send a simple confirmation message
    res.status(200).send('Potvrzeno');

    // Generate Google Calendar event link
    const googleCalendarUrl = generateGoogleCalendarUrl(appointment);

    // Prepare appointment details for email
    const appointmentDetails = `
      Appointment Details:
      - Start Date: ${appointment.startDate}
      - End Date: ${appointment.endDate}
      - User: ${appointment.user.name} ${appointment.user.surname}
      - User Email: ${appointment.user.email}
      - User Phone: ${appointment.user.phone}
      - Price: ${appointment.price}
    `;

    // Prepare HTML content
    const htmlContent = `
      <html>
        <head>
          <title>Vypůjčka potvrzena!</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h1 style="color: #28a745;">Potvrzeno!</h1>
          <p style="font-size: 16px;">Vaše vypůjčka byla potvrzena.</p>
          <p style="font-size: 16px;">Detaily vypůjčky:</p>
          <p><strong>Začátek:</strong> ${formatDateInCzech(appointment.startDate)}</p>
          <p><strong>Konec:</strong> ${formatDateInCzech(appointment.endDate)}</p>
          <p><strong>Cena:</strong> ${appointment.price} kč</p>
          <div style="margin-top: 20px;">
            <a href="${googleCalendarUrl}" target="_blank" style="padding: 10px 20px; background-color: #0073e6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Přidat do Google Kalendáře
            </a>
          </div>
        </body>
      </html>
    `;

    // Send the email with the custom HTML content
    await sendEmail(
      appointment.user.email, // Send to the user's email
      'Vypůjčka potvrzena!',
      `Vaše vypůjčka byla potvrzena!`,
      htmlContent // Passing the htmlContent as an argument here
    );

  } catch (error) {
    next(error);
  }
};


const generateGoogleCalendarUrl = (appointment: any): string => {
  // Subtract 1 hour from the start and end dates to fix the +1 hour issue
  const startDate = dayjs(appointment.startDate).utc().subtract(1, 'hour').format('YYYYMMDDTHHmmss[Z]');
  const endDate = dayjs(appointment.endDate).utc().subtract(1, 'hour').format('YYYYMMDDTHHmmss[Z]');

  const summary = encodeURIComponent('Vyzvednout vozík THULE');
  const location = encodeURIComponent('Kapitána Fechtnera, Kpt. Fechtnera, 500 09 Hradec Králové 9, Česko');
  const description = encodeURIComponent(`Cena: ${appointment.price} Kč`);

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${summary}&dates=${startDate}/${endDate}&details=${description}&location=${location}&sf=true&output=xml`;
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
