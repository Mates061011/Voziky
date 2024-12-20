import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import path from 'path';

// Helper function to sanitize inputs
const sanitizeInput = (input: string): string => {
    return input.replace(/[\r\n]/g, '').trim();
};

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  htmlContent: string, // Adding the htmlContent as a parameter
  qrData?: {
    variableSymbol: Number;
    paymentInfo: string; // A string to generate the QR code
  }
): Promise<void> => {
  const sanitizedTo = sanitizeInput(to);
  const sanitizedSubject = sanitizeInput(subject);
  const sanitizedText = sanitizeInput(text);

  if (!isValidEmail(sanitizedTo)) {
    throw new Error('Invalid email address format');
  }

  // Nodemailer transporter setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let qrFilePath: string | undefined;
  let qrCid: string | undefined;
  if (qrData) {
    const tempPath = path.join(__dirname, 'tempQRCode.png');
    await QRCode.toFile(tempPath, qrData.paymentInfo);
    qrFilePath = tempPath;
    qrCid = 'qrcode';
  }

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.EMAIL_USER,
    to: sanitizedTo,
    subject: sanitizedSubject,
    text: sanitizedText,
    html: htmlContent, // Use the passed htmlContent here
    attachments: qrFilePath
      ? [
          {
            filename: 'paymentQRCode.png',
            path: qrFilePath,
            cid: qrCid,
          },
        ]
      : [],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

  

export default sendEmail;
