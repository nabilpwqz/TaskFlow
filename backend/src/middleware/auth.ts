// Authentication Middleware
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError, errorMessages } from '../utils/errors';
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
      token?: string;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      throw new AppError(
        errorMessages.UNAUTHORIZED.message,
        errorMessages.UNAUTHORIZED.statusCode
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new AppError(
        errorMessages.INVALID_TOKEN.message,
        errorMessages.INVALID_TOKEN.statusCode
      );
    }

    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError(
        errorMessages.USER_NOT_FOUND.message,
        errorMessages.USER_NOT_FOUND.statusCode
      );
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    req.token = token;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden - Admin access required' });
    return;
  }
  next();
}
