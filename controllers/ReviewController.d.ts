import { Request, Response, NextFunction } from 'express';
export declare class ReviewController {
    getTaskReviews(req: Request, res: Response, next: NextFunction): Promise<void>;
    createReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteReview(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const reviewController: ReviewController;
//# sourceMappingURL=ReviewController.d.ts.map