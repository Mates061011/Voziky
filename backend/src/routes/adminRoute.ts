import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/adminModel';

const router = express.Router();


// Login route to authenticate user
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'Uživatel nenalezen' });
      return;
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Nesprávné heslo' });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET!, // Secret key
      { expiresIn: '1h' } // Token expiration
    );

    res.status(200).json({
      message: 'Přihlášení bylo úspěšné',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Chyba serveru', error: error.message });
  }
});

export default router;
