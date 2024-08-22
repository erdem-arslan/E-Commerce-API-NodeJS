import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DB_URI;

if (!uri) {
  console.error('MongoDB URI is not defined in the environment variables');
  process.exit(1);
}

const client = new MongoClient(uri);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db();
  } catch (err) {
    console.error('Database connection failed', err);
    process.exit(1);
  }
};
