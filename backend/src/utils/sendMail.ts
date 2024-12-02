import nodemailer from 'nodemailer';

// Helper function to sanitize inputs
const sanitizeInput = (input: string): string => {
    return input.replace(/[\r\n]/g, '').trim();
};

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Secure sendEmail function
const sendEmail = async (to: string, subject: string, text: string, html?: string): Promise<void> => {
    // Sanitize inputs
    const sanitizedTo = sanitizeInput(to);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedText = sanitizeInput(text);
    const sanitizedHtml = html ? sanitizeInput(html) : undefined;

    // Validate email format and length restrictions
    if (!isValidEmail(sanitizedTo)) {
        throw new Error('Invalid email address format');
    }
    if (sanitizedSubject.length > 100) {
        throw new Error('Subject exceeds the maximum length of 100 characters');
    }
    if (sanitizedText.length > 1000) {
        throw new Error('Email body exceeds the maximum length of 1000 characters');
    }

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // The sender's email from environment variables
            pass: process.env.EMAIL_APP_PASSWORD, // App password from environment variables
        },
    });

    // Prepare email options
    const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_USER,
        to: sanitizedTo,
        subject: sanitizedSubject,
        text: sanitizedText,
    };

    // Include HTML content if provided
    if (sanitizedHtml) {
        mailOptions.html = sanitizedHtml;
    }

    // Try to send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email'); // Rethrow error for higher-level handling
    }
};

export default sendEmail;
