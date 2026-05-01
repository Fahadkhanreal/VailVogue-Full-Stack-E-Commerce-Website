import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken } from '../utils/jwt.utils';
import { successResponse, errorResponse } from '../utils/response.utils';
import { AuthRequest } from '../middleware/auth.middleware';
import { RegisterInput, LoginInput } from '../types/auth.types';
import { sendPasswordResetEmail } from '../utils/email.utils';
import prisma from '../utils/prisma.utils';

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone } = req.body as RegisterInput;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      errorResponse(res, 'Email already exists', 409);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    successResponse(
      res,
      {
        user: userWithoutPassword,
        token,
      },
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    errorResponse(res, 'Registration failed', 500);
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    successResponse(res, {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, 'Login failed', 500);
  }
};

// Get current user profile
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required', 401);
      return;
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    successResponse(res, user);
  } catch (error) {
    console.error('GetMe error:', error);
    errorResponse(res, 'Failed to fetch user profile', 500);
  }
};

// Forgot Password - Send reset email
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      successResponse(res, { message: 'If the email exists, a reset link has been sent' });
      return;
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send email
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetToken,
    });

    successResponse(res, { message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('ForgotPassword error:', error);
    errorResponse(res, 'Failed to process password reset request', 500);
  }
};

// Verify Reset Token
export const verifyResetToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const resetToken = Array.isArray(token) ? token[0] : token;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: resetToken,
        resetTokenExpiry: {
          gte: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      errorResponse(res, 'Invalid or expired reset token', 400);
      return;
    }

    successResponse(res, { valid: true });
  } catch (error) {
    console.error('VerifyResetToken error:', error);
    errorResponse(res, 'Failed to verify reset token', 500);
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      errorResponse(res, 'Invalid or expired reset token', 400);
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    successResponse(res, { message: 'Password reset successful' });
  } catch (error) {
    console.error('ResetPassword error:', error);
    errorResponse(res, 'Failed to reset password', 500);
  }
};
