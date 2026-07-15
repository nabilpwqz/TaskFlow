// Review Service
import { Review, IReviewDocument } from '../models/Review';
import { Task } from '../models/Task';
import { AppError, errorMessages } from '../utils/errors';
import { CreateReviewInput } from '../utils/validation';

export class ReviewService {
  async getTaskReviews(taskId: string): Promise<IReviewDocument[]> {
    return Review.find({ taskId }).populate('userId', 'name avatar').sort({ createdAt: -1 });
  }

  async createReview(
    taskId: string,
    userId: string,
    data: CreateReviewInput
  ): Promise<IReviewDocument> {
    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError(
        errorMessages.TASK_NOT_FOUND.message,
        errorMessages.TASK_NOT_FOUND.statusCode
      );
    }

    // Check if user already reviewed this task
    const existingReview = await Review.findOne({ taskId, userId });
    if (existingReview) {
      throw new AppError(
        errorMessages.DUPLICATE_REVIEW.message,
        errorMessages.DUPLICATE_REVIEW.statusCode
      );
    }

    // Create review
    const review = await Review.create({
      taskId,
      userId,
      rating: data.rating,
      comment: data.comment,
    });

    // Update task rating
    await this.updateTaskRating(taskId);

    return review.populate('userId', 'name avatar');
  }

  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError(
        errorMessages.REVIEW_NOT_FOUND.message,
        errorMessages.REVIEW_NOT_FOUND.statusCode
      );
    }

    // Check ownership
    if (review.userId.toString() !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    const taskId = review.taskId;
    await Review.deleteOne({ _id: reviewId });

    // Update task rating
    await this.updateTaskRating(taskId.toString());
  }

  private async updateTaskRating(taskId: string): Promise<void> {
    const reviews = await Review.find({ taskId });

    if (reviews.length === 0) {
      await Task.updateOne({ _id: taskId }, { rating: 0, reviewCount: 0 });
      return;
    }

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Task.updateOne(
      { _id: taskId },
      {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      }
    );
  }
}

export const reviewService = new ReviewService();
