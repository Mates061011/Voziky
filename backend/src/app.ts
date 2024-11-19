import express, { Application } from 'express';
import cors from 'cors'; // Import cors
import appointmentRoute from './routes/appointmentRoute';

const app: Application = express();

// Middleware
app.use(cors());  // Enable CORS globally
app.use(express.json());

// Routes
app.use('/api/appointment', appointmentRoute);

export default app;
