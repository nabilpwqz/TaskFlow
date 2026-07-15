// Task Routes
import { Router } from 'express';
import { taskController } from '../controllers/TaskController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', (req, res, next) => taskController.getAllTasks(req, res, next));
router.get('/:id', (req, res, next) => taskController.getTaskById(req, res, next));
router.post('/', authMiddleware, (req, res, next) => taskController.createTask(req, res, next));
router.put('/:id', authMiddleware, (req, res, next) => taskController.updateTask(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => taskController.deleteTask(req, res, next));
router.get('/user/my-tasks', authMiddleware, (req, res, next) => taskController.getUserTasks(req, res, next));

export default router;
