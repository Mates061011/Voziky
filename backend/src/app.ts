import express, { Application } from 'express';
import cors from 'cors'; // Import cors
import appointmentRoute from './routes/appointmentRoute';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appointment', appointmentRoute);

// Test Route
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Test route is working!' });
});

export default app;
