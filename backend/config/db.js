import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

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
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-streaming');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedInitialAdmin();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
  }
};

export default connectDB;

