import { Request, Response, NextFunction } from 'express';
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
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function adminMiddleware(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map