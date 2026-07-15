// Task Service
import { Task, ITaskDocument } from '../models/Task';
import { Review } from '../models/Review';
import { AppError, errorMessages } from '../utils/errors';
import { CreateTaskInput, UpdateTaskInput } from '../utils/validation';

export interface ITaskFilters {
  search?: string;
  category?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  page?: number;
  limit?: number;
}

export class TaskService {
  async getAllTasks(filters: ITaskFilters = {}) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, filters.limit || 8);
    const skip = (page - 1) * limit;

    let query = Task.find();

    // Search
    if (filters.search) {
      query = query.find({
        $or: [
          { title: { $regex: filters.search, $options: 'i' } },
          { shortDesc: { $regex: filters.search, $options: 'i' } },
          { fullDesc: { $regex: filters.search, $options: 'i' } },
        ],
      });
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      query = query.where('category').equals(filters.category);
    }

    // Sorting
    if (filters.sort === 'price-asc') {
      query = query.sort({ price: 1 });
    } else if (filters.sort === 'price-desc') {
      query = query.sort({ price: -1 });
    } else if (filters.sort === 'rating') {
      query = query.sort({ rating: -1 });
    } else {
      query = query.sort({ createdAt: -1 }); // Default: newest
    }

    // Execute query
    const total = await Task.countDocuments(query);
    const tasks = await query.skip(skip).limit(limit).populate('userId', 'name email avatar');

    return {
      items: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTaskById(taskId: string): Promise<ITaskDocument | null> {
    const task = await Task.findById(taskId).populate('userId', 'name email avatar');
    if (!task) {
      throw new AppError(
        errorMessages.TASK_NOT_FOUND.message,
        errorMessages.TASK_NOT_FOUND.statusCode
      );
    }

    // Get reviews
    const reviews = await Review.find({ taskId }).populate('userId', 'name avatar');

    return {
      ...task.toObject(),
      reviews,
    } as any;
  }

  async createTask(userId: string, data: CreateTaskInput): Promise<ITaskDocument> {
    const task = await Task.create({
      ...data,
      userId,
    });

    return task.populate('userId', 'name email avatar');
  }

  async updateTask(
    taskId: string,
    userId: string,
    data: UpdateTaskInput
  ): Promise<ITaskDocument> {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError(
        errorMessages.TASK_NOT_FOUND.message,
        errorMessages.TASK_NOT_FOUND.statusCode
      );
    }

    // Check ownership
    if (task.userId.toString() !== userId) {
      throw new AppError(
        errorMessages.TASK_PERMISSION_DENIED.message,
        errorMessages.TASK_PERMISSION_DENIED.statusCode
      );
    }

    // Update task
    Object.assign(task, data);
    await task.save();

    return task.populate('userId', 'name email avatar');
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError(
        errorMessages.TASK_NOT_FOUND.message,
        errorMessages.TASK_NOT_FOUND.statusCode
      );
    }

    // Check ownership
    if (task.userId.toString() !== userId) {
      throw new AppError(
        errorMessages.TASK_PERMISSION_DENIED.message,
        errorMessages.TASK_PERMISSION_DENIED.statusCode
      );
    }

    // Delete task and its reviews
    await Task.deleteOne({ _id: taskId });
    await Review.deleteMany({ taskId });
  }

  async getUserTasks(userId: string): Promise<ITaskDocument[]> {
    return Task.find({ userId }).sort({ createdAt: -1 }).populate('userId', 'name email avatar');
  }
}

export const taskService = new TaskService();
