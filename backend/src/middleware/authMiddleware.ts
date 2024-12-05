import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, IUserWithoutPassword } from '../types/admin.type'; // Import IUser and IUserWithoutPassword

// Define the payload type for the JWT, without the 'password' field
type DecodedToken = Pick<IUser, 'email'> & { _id: string }; // Include _id for the token payload

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    res.status(403).json({ message: 'Token is required' });
    return;
  }

  try {
    // Verify the token and cast the decoded data to DecodedToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // Attach decoded user data (including _id) to req.user as IUserWithoutPassword
    req.user = decoded as IUserWithoutPassword;

    console.log('Decoded token:', decoded); // Debugging log
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;
