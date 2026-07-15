// Error Handler Middleware
import { Request, Response, NextFunction } from 'express';
import { AppError, errorMessages } from '../utils/errors';
import { ZodError } from 'zod';

export function errorHandler(
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    res.status(400).json({
      error: errorMessages.VALIDATION_ERROR.message,
      details: messages,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  // MongoDB errors
  if (error.name === 'CastError') {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern)[0];
    res.status(409).json({ error: `${field} already exists` });
    return;
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values((error as any).errors)
      .map((e: any) => e.message)
      .join(', ');
    res.status(400).json({ error: messages });
    return;
  }

  // Default error
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? errorMessages.INTERNAL_SERVER_ERROR.message 
      : error.message 
  });
}
