import mongoose from 'mongoose';

const connectDB = async (retries = 5) => {
  try {
    const dbURI = process.env.MONGODB_URI || '';
    if (!dbURI) {
      console.error('MongoDB URI is not set');
      process.exit(1);
    }
    await mongoose.connect(dbURI);
    console.log('MongoDB connected');
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying MongoDB connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);  // Retry every 5 seconds
    } else {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }
};


export default connectDB;
