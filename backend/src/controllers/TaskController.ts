// Task Controller
import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/TaskService';
import { createTaskSchema, updateTaskSchema } from '../utils/validation';

export class TaskController {
  async getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        sort: (req.query.sort as any) || 'newest',
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 8,
      };

      const result = await taskService.getAllTasks(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.getTaskById(req.params.id);
      res.status(200).json({ task });
    } catch (error) {
      next(error);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createTaskSchema.parse(req.body);
      const task = await taskService.createTask(req.user!.userId, data);

      res.status(201).json({
        message: 'Task created successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = updateTaskSchema.parse(req.body);
      const task = await taskService.updateTask(req.params.id, req.user!.userId, data);

      res.status(200).json({
        message: 'Task updated successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await taskService.deleteTask(req.params.id, req.user!.userId);

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getUserTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await taskService.getUserTasks(req.user!.userId);

      res.status(200).json({ tasks });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
