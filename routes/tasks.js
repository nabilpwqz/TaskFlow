"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Task Routes
const express_1 = require("express");
const TaskController_1 = require("../controllers/TaskController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => TaskController_1.taskController.getAllTasks(req, res, next));
router.get('/:id', (req, res, next) => TaskController_1.taskController.getTaskById(req, res, next));
router.post('/', auth_1.authMiddleware, (req, res, next) => TaskController_1.taskController.createTask(req, res, next));
router.put('/:id', auth_1.authMiddleware, (req, res, next) => TaskController_1.taskController.updateTask(req, res, next));
router.delete('/:id', auth_1.authMiddleware, (req, res, next) => TaskController_1.taskController.deleteTask(req, res, next));
router.get('/user/my-tasks', auth_1.authMiddleware, (req, res, next) => TaskController_1.taskController.getUserTasks(req, res, next));
exports.default = router;
//# sourceMappingURL=tasks.js.map