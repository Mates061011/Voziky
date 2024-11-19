import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

dotenv.config();

// Connect to MongoDB
connectDB();

// Start the server
const PORT: number = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
