import express, { Request, Response, NextFunction } from 'express';
import sendEmail from '../utils/sendMail';
const router = express.Router();


const SendQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, question } = req.body;
    try {
        await sendEmail(
            'vozikybackend@gmail.com',
            `DOTAZ od ${name}: ${question}`,
            `${email} ${name} se ptá: ${question}`
        );
        res.status(201).json("Dotaz poslán ůspěšně.");
    } catch (error) {
        next(error);
    }
}

router.post('/' ,SendQuestion);

export default router;