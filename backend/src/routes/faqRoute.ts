import express, { Request, Response, NextFunction } from 'express';
import sendEmail from '../utils/sendMail';

const router = express.Router();

const SendQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, question } = req.body;

    try {
        // Compose the email content
        const subject = `DOTAZ od ${name}: ${question}`;
        const textContent = `${email} ${name} se ptá: ${question}`;
        const htmlContent = `
            <p><strong>Email od:</strong> ${email}</p>
            <p><strong>Jméno:</strong> ${name}</p>
            <p><strong>Dotaz:</strong> ${question}</p>
        `;

        // Send the email using sendEmail
        await sendEmail(
            'vozikybackend@gmail.com',
            subject,
            textContent,
            htmlContent
        );

        res.status(201).json({ message: "Dotaz poslán úspěšně." });
    } catch (error) {
        next(error);
    }
};

// Define the route
router.post('/', SendQuestion);

export default router;
