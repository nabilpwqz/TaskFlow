// Review Routes
import { Router } from 'express';
import { reviewController } from '../controllers/ReviewController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/:taskId/reviews', (req, res, next) => reviewController.getTaskReviews(req, res, next));
router.post('/:taskId/reviews', authMiddleware, (req, res, next) => reviewController.createReview(req, res, next));
router.delete('/reviews/:reviewId', authMiddleware, (req, res, next) => reviewController.deleteReview(req, res, next));

export default router;
