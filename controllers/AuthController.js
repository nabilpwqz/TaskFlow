"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const validation_1 = require("../utils/validation");
const jwt_1 = require("../config/jwt");
class AuthController {
    async register(req, res, next) {
        try {
            const data = validation_1.registerSchema.parse(req.body);
            const result = await AuthService_1.authService.register(data);
            res.cookie(jwt_1.jwtConfig.cookieName, result.token, jwt_1.jwtConfig.cookieOptions);
            res.status(201).json({
                message: 'User registered successfully',
                token: result.token,
                user: result.user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const data = validation_1.loginSchema.parse(req.body);
            const result = await AuthService_1.authService.login(data);
            res.cookie(jwt_1.jwtConfig.cookieName, result.token, jwt_1.jwtConfig.cookieOptions);
            res.status(200).json({
                message: 'Login successful',
                token: result.token,
                user: result.user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCurrentUser(req, res, next) {
        try {
            const user = await AuthService_1.authService.getCurrentUser(req.user.userId);
            res.status(200).json({ user });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            res.clearCookie(jwt_1.jwtConfig.cookieName);
            res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=AuthController.js.map