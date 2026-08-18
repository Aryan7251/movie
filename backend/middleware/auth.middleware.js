import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized to access this route'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) {
      res.status(401);
      return next(new Error('Admin not found'));
    }
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401);
    return next(new Error('Not authorized to access this route'));
  }
};
