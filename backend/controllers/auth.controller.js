import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d'
  });
};

export const setupAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const adminExists = await Admin.findOne();
    if (adminExists) {
      res.status(400);
      throw new Error('Admin already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ username, passwordHash });

    res.status(201).json({
      success: true,
      admin: { id: admin._id, username: admin.username }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      const token = generateToken(admin._id);
      
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        success: true,
        token,
        admin: { id: admin._id, username: admin.username }
      });
    } else {
      res.status(401);
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie('auth_token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ success: true });
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      admin: { id: req.admin._id, username: req.admin.username }
    });
  } catch (error) {
    next(error);
  }
};
