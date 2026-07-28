import mongoose from 'mongoose';

let dbConnected = false;

export function isDBConnected() {
  return dbConnected;
}

export async function connectDB() {
  const uri = process.env.DATABASE;
  if (!uri) {
    console.warn('DATABASE not set in .env — MongoDB features disabled.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    dbConnected = true;
    console.log('MongoDB connected successfully.');
    return true;
  } catch (err) {
    dbConnected = false;
    console.error('MongoDB connection error:', err.message);
    console.error('Check DATABASE in .env and MongoDB Atlas network access (IP whitelist).');
    return false;
  }
}
