import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.utils';
import { successResponse, errorResponse } from '../utils/response.utils';
import { AuthRequest } from '../middleware/auth.middleware';
import { RegisterInput, LoginInput } from '../types/auth.types';
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
