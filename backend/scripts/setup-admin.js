import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import Admin from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const setupAdmin = async () => {
  try {
    const { ADMIN_USERNAME, ADMIN_PASSWORD, MONGODB_URI } = process.env;
    
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('Please provide ADMIN_USERNAME and ADMIN_PASSWORD in .env');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/movie-streaming');
    console.log('Connected to MongoDB');

    const adminExists = await Admin.findOne();
    if (adminExists) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await Admin.create({ username: ADMIN_USERNAME, passwordHash });
    console.log(`Admin user '${ADMIN_USERNAME}' created successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setupAdmin();
