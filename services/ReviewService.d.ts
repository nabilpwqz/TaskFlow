import { IReviewDocument } from '../models/Review';
import { CreateReviewInput } from '../utils/validation';
export declare class ReviewService {
    getTaskReviews(taskId: string): Promise<IReviewDocument[]>;
    createReview(taskId: string, userId: string, data: CreateReviewInput): Promise<IReviewDocument>;
    deleteReview(reviewId: string, userId: string): Promise<void>;
    private updateTaskRating;
}
export declare const reviewService: ReviewService;
//# sourceMappingURL=ReviewService.d.ts.map