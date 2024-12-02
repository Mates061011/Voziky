import express, { Application } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';  // Import express-rate-limit
import appointmentRoute from './routes/appointmentRoute';
import faqRoute from './routes/faqRoute';
const app: Application = express();

// Rate limiting setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes window
  max: 100,                  // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',  // Message sent when rate limit is exceeded
});

// Apply rate limiting globally to all routes
app.use(limiter);

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appointment', appointmentRoute);
app.use('/api/faq', faqRoute);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
