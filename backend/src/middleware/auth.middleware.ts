import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { errorResponse } from '../utils/response.utils';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Authentication required', 401);
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    errorResponse(res, 'Invalid or expired token', 401);
  }
};
