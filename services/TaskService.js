"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = exports.TaskService = void 0;
// Task Service
const Task_1 = require("../models/Task");
const Review_1 = require("../models/Review");
const errors_1 = require("../utils/errors");
class TaskService {
    async getAllTasks(filters = {}) {
        const page = Math.max(1, filters.page || 1);
        const limit = Math.min(100, filters.limit || 8);
        const skip = (page - 1) * limit;
        let query = Task_1.Task.find();
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
        }
        else if (filters.sort === 'price-desc') {
            query = query.sort({ price: -1 });
        }
        else if (filters.sort === 'rating') {
            query = query.sort({ rating: -1 });
        }
        else {
            query = query.sort({ createdAt: -1 }); // Default: newest
        }
        // Execute query
        const total = await Task_1.Task.countDocuments(query);
        const tasks = await query.skip(skip).limit(limit).populate('userId', 'name email avatar');
        return {
            items: tasks,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getTaskById(taskId) {
        const task = await Task_1.Task.findById(taskId).populate('userId', 'name email avatar');
        if (!task) {
            throw new errors_1.AppError(errors_1.errorMessages.TASK_NOT_FOUND.message, errors_1.errorMessages.TASK_NOT_FOUND.statusCode);
        }
        // Get reviews
        const reviews = await Review_1.Review.find({ taskId }).populate('userId', 'name avatar');
        return {
            ...task.toObject(),
            reviews,
        };
    }
    async createTask(userId, data) {
        const task = await Task_1.Task.create({
            ...data,
            userId,
        });
        return task.populate('userId', 'name email avatar');
    }
    async updateTask(taskId, userId, data) {
        const task = await Task_1.Task.findById(taskId);
        if (!task) {
            throw new errors_1.AppError(errors_1.errorMessages.TASK_NOT_FOUND.message, errors_1.errorMessages.TASK_NOT_FOUND.statusCode);
        }
        // Check ownership
        if (task.userId.toString() !== userId) {
            throw new errors_1.AppError(errors_1.errorMessages.TASK_PERMISSION_DENIED.message, errors_1.errorMessages.TASK_PERMISSION_DENIED.statusCode);
        }
        // Update task
        Object.assign(task, data);
        await task.save();
        return task.populate('userId', 'name email avatar');
    }
    async deleteTask(taskId, userId) {
        const task = await Task_1.Task.findById(taskId);
        if (!task) {
            throw new errors_1.AppError(errors_1.errorMessages.TASK_NOT_FOUND.message, errors_1.errorMessages.TASK_NOT_FOUND.statusCode);
        }
        // Check ownership
        if (task.userId.toString() !== userId) {
            throw new errors_1.AppError(errors_1.errorMessages.TASK_PERMISSION_DENIED.message, errors_1.errorMessages.TASK_PERMISSION_DENIED.statusCode);
        }
        // Delete task and its reviews
        await Task_1.Task.deleteOne({ _id: taskId });
        await Review_1.Review.deleteMany({ taskId });
    }
    async getUserTasks(userId) {
        return Task_1.Task.find({ userId }).sort({ createdAt: -1 }).populate('userId', 'name email avatar');
    }
}
exports.TaskService = TaskService;
exports.taskService = new TaskService();
//# sourceMappingURL=TaskService.js.map