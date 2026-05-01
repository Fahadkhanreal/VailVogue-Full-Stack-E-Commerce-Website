import { Router } from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
  verifyResetToken,
  resetPassword
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../types/auth.types';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

// Protected routes
router.get('/me', authMiddleware, getMe);

export default router;
