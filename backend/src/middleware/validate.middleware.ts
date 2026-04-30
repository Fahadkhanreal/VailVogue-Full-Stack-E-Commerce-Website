import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/response.utils';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.reduce((acc: Record<string, string>, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        }, {} as Record<string, string>);

        errorResponse(res, 'Validation failed', 400, errors);
      } else {
        errorResponse(res, 'Validation error', 400);
      }
    }
  };
};
