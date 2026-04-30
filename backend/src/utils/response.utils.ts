import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export const successResponse = <T>(res: Response, data: T, statusCode: number = 200): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  error: string,
  statusCode: number = 500,
  details?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    error,
    ...(details && { details }),
  };
  return res.status(statusCode).json(response);
};
