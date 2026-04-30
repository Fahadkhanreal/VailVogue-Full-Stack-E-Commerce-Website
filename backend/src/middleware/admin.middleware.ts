import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { errorResponse } from '../utils/response.utils';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    errorResponse(res, 'Authentication required', 401);
    return;
  }

  if (req.user.role !== 'ADMIN') {
    errorResponse(res, 'Insufficient permissions. Admin access required.', 403);
    return;
  }

  next();
};
