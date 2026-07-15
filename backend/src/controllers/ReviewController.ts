// Review Controller
import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/ReviewService';
import { createReviewSchema } from '../utils/validation';

export class ReviewController {
  async getTaskReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviews = await reviewService.getTaskReviews(req.params.taskId);

      res.status(200).json({ reviews });
    } catch (error) {
      next(error);
    }
  }

  async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createReviewSchema.parse(req.body);
      const review = await reviewService.createReview(
        req.params.taskId,
        req.user!.userId,
        data
      );

      res.status(201).json({
        message: 'Review created successfully',
        review,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await reviewService.deleteReview(req.params.reviewId, req.user!.userId);

      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
