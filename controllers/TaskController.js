"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = exports.TaskController = void 0;
const TaskService_1 = require("../services/TaskService");
const validation_1 = require("../utils/validation");
class TaskController {
    async getAllTasks(req, res, next) {
        try {
            const filters = {
                search: req.query.search,
                category: req.query.category,
                sort: req.query.sort || 'newest',
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 8,
            };
            const result = await TaskService_1.taskService.getAllTasks(filters);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getTaskById(req, res, next) {
        try {
            const task = await TaskService_1.taskService.getTaskById(req.params.id);
            res.status(200).json({ task });
        }
        catch (error) {
            next(error);
        }
    }
    async createTask(req, res, next) {
        try {
            const data = validation_1.createTaskSchema.parse(req.body);
            const task = await TaskService_1.taskService.createTask(req.user.userId, data);
            res.status(201).json({
                message: 'Task created successfully',
                task,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateTask(req, res, next) {
        try {
            const data = validation_1.updateTaskSchema.parse(req.body);
            const task = await TaskService_1.taskService.updateTask(req.params.id, req.user.userId, data);
            res.status(200).json({
                message: 'Task updated successfully',
                task,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteTask(req, res, next) {
        try {
            await TaskService_1.taskService.deleteTask(req.params.id, req.user.userId);
            res.status(200).json({ message: 'Task deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserTasks(req, res, next) {
        try {
            const tasks = await TaskService_1.taskService.getUserTasks(req.user.userId);
            res.status(200).json({ tasks });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TaskController = TaskController;
exports.taskController = new TaskController();
//# sourceMappingURL=TaskController.js.map