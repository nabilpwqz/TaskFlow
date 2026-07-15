"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Auth Routes
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/register', (req, res, next) => AuthController_1.authController.register(req, res, next));
router.post('/login', (req, res, next) => AuthController_1.authController.login(req, res, next));
router.get('/me', auth_1.authMiddleware, (req, res, next) => AuthController_1.authController.getCurrentUser(req, res, next));
router.post('/logout', auth_1.authMiddleware, (req, res, next) => AuthController_1.authController.logout(req, res, next));
exports.default = router;
//# sourceMappingURL=auth.js.map