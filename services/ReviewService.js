"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = exports.ReviewService = void 0;
// Review Service
const Review_1 = require("../models/Review");
const Task_1 = require("../models/Task");
const errors_1 = require("../utils/errors");
class ReviewService {
    async getTaskReviews(taskId) {
        return Review_1.Review.find({ taskId }).populate('userId', 'name avatar').sort({ createdAt: -1 });
    }
    async createReview(taskId, userId, data) {
        // Check if task exists
        const task = await Task_1.Task.findById(taskId);
        if (!task) {
            throw new errors_1.AppError(errors_1.errorMessages.TASK_NOT_FOUND.message, errors_1.errorMessages.TASK_NOT_FOUND.statusCode);
        }
        // Check if user already reviewed this task
        const existingReview = await Review_1.Review.findOne({ taskId, userId });
        if (existingReview) {
            throw new errors_1.AppError(errors_1.errorMessages.DUPLICATE_REVIEW.message, errors_1.errorMessages.DUPLICATE_REVIEW.statusCode);
        }
        // Create review
        const review = await Review_1.Review.create({
            taskId,
            userId,
            rating: data.rating,
            comment: data.comment,
        });
        // Update task rating
        await this.updateTaskRating(taskId);
        return review.populate('userId', 'name avatar');
    }
    async deleteReview(reviewId, userId) {
        const review = await Review_1.Review.findById(reviewId);
        if (!review) {
            throw new errors_1.AppError(errors_1.errorMessages.REVIEW_NOT_FOUND.message, errors_1.errorMessages.REVIEW_NOT_FOUND.statusCode);
        }
        // Check ownership
        if (review.userId.toString() !== userId) {
            throw new errors_1.AppError('Unauthorized', 403);
        }
        const taskId = review.taskId;
        await Review_1.Review.deleteOne({ _id: reviewId });
        // Update task rating
        await this.updateTaskRating(taskId.toString());
    }
    async updateTaskRating(taskId) {
        const reviews = await Review_1.Review.find({ taskId });
        if (reviews.length === 0) {
            await Task_1.Task.updateOne({ _id: taskId }, { rating: 0, reviewCount: 0 });
            return;
        }
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Task_1.Task.updateOne({ _id: taskId }, {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length,
        });
    }
}
exports.ReviewService = ReviewService;
exports.reviewService = new ReviewService();
//# sourceMappingURL=ReviewService.js.map