import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';
export declare function errorHandler(error: Error | AppError | ZodError, req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map