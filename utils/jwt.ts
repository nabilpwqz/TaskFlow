// JWT Utilities
import jwt from 'jsonwebtoken';
import { IAuthPayload } from '../types';
import { jwtConfig } from '../config/jwt';

export function generateToken(payload: Omit<IAuthPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload as Record<string, unknown>, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  } as Parameters<typeof jwt.sign>[2]);
}

export function verifyToken(token: string): IAuthPayload | null {
  try {
    return jwt.verify(token, jwtConfig.secret) as IAuthPayload;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string): IAuthPayload | null {
  try {
    const decoded = jwt.decode(token);
    return (decoded as IAuthPayload) || null;
  } catch (error) {
    return null;
  }
}
