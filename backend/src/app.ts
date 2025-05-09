import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit'; // Import express-rate-limit
import appointmentRoute from './routes/appointmentRoute';
import faqRoute from './routes/faqRoute';
import adminRoute from './routes/adminRoute';
import itemRoute from './routes/itemRoute';

const app: Application = express();

// Rate limiting setup
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,  // 30 minutes window
  max: 200,                  // Limit each IP to 100 requests per 30 minutes
  message: 'Too many requests from this IP, please try again later.',
});

// Apply rate limiting globally to all routes
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'https://vozikyfrontend.onrender.com',
  'http://localhost:5173',
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true, // Allow cookies and HTTP auth headers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware setup
app.use(express.json());

// Routes
app.use('/api/appointment', appointmentRoute);
app.use('/api/faq', faqRoute);
app.use('/api', adminRoute);
app.use('/api/items', itemRoute);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message || err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
