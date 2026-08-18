import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

let mongodInstance = null;

const seedInitialAdmin = async () => {
  try {
    const adminExists = await Admin.findOne();
    if (!adminExists) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'change-this-password';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      await Admin.create({ username, passwordHash });
      console.log(`Initial admin '${username}' created automatically.`);
    }
  } catch (err) {
    console.warn('Auto-seed admin notice:', err.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const isCustomUri = uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) && !uri.includes('<db_username>');

  if (isCustomUri) {
    try {
      console.log('Connecting to configured MongoDB...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      await seedInitialAdmin();
      return;
    } catch (error) {
      console.error(`MongoDB connection error to remote URI: ${error.message}`);
      console.log('Falling back to embedded zero-config database...');
    }
  }

  // Fallback to embedded in-memory MongoDB
  try {
    console.log('Starting embedded zero-config MongoDB database...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const fallbackUri = mongodInstance.getUri();
    const conn = await mongoose.connect(fallbackUri);
    console.log(`Embedded MongoDB Connected: ${conn.connection.host}`);
    await seedInitialAdmin();
  } catch (embeddedErr) {
    console.error('Failed to initialize embedded database:', embeddedErr.message);
  }
};

export default connectDB;


