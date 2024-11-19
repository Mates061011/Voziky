import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Ensure this is the correct email
      pass: process.env.EMAIL_APP_PASSWORD, // Ensure this is the correct app password
    },
  });

  // Try sending the email
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // The sender's email
      to,
      subject,
      text,
    });
    console.log('Email sent successfully: ', info);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
