"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = exports.ReviewController = void 0;
const ReviewService_1 = require("../services/ReviewService");
const validation_1 = require("../utils/validation");
class ReviewController {
    async getTaskReviews(req, res, next) {
        try {
            const reviews = await ReviewService_1.reviewService.getTaskReviews(req.params.taskId);
            res.status(200).json({ reviews });
        }
        catch (error) {
            next(error);
        }
    }
    async createReview(req, res, next) {
        try {
            const data = validation_1.createReviewSchema.parse(req.body);
            const review = await ReviewService_1.reviewService.createReview(req.params.taskId, req.user.userId, data);
            res.status(201).json({
                message: 'Review created successfully',
                review,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteReview(req, res, next) {
        try {
            await ReviewService_1.reviewService.deleteReview(req.params.reviewId, req.user.userId);
            res.status(200).json({ message: 'Review deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReviewController = ReviewController;
exports.reviewController = new ReviewController();
//# sourceMappingURL=ReviewController.js.map