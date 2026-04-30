import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.utils';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle specific error types
  if (err.name === 'JsonWebTokenError') {
    errorResponse(res, 'Invalid token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    errorResponse(res, 'Token expired', 401);
    return;
  }

  // Default error response
  errorResponse(res, err.message || 'Internal server error', 500);
};
