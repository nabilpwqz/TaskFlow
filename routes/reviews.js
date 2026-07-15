"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Review Routes
const express_1 = require("express");
const ReviewController_1 = require("../controllers/ReviewController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/:taskId/reviews', (req, res, next) => ReviewController_1.reviewController.getTaskReviews(req, res, next));
router.post('/:taskId/reviews', auth_1.authMiddleware, (req, res, next) => ReviewController_1.reviewController.createReview(req, res, next));
router.delete('/reviews/:reviewId', auth_1.authMiddleware, (req, res, next) => ReviewController_1.reviewController.deleteReview(req, res, next));
exports.default = router;
//# sourceMappingURL=reviews.js.map