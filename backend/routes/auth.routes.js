import express from 'express';
import { setupAdmin, login, logout, getMe } from '../controllers/auth.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import { validateAuth } from '../validation/movie.validation.js';

const router = express.Router();

router.post('/setup', authLimiter, validateAuth, setupAdmin);
router.post('/login', authLimiter, validateAuth, login);
router.post('/logout', logout);
router.get('/me', protectAdmin, getMe);

export default router;
