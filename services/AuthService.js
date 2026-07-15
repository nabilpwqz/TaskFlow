"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
// Auth Service
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
class AuthService {
    async register(data) {
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email: data.email });
        if (existingUser) {
            throw new errors_1.AppError(errors_1.errorMessages.EMAIL_ALREADY_EXISTS.message, errors_1.errorMessages.EMAIL_ALREADY_EXISTS.statusCode);
        }
        // Create new user
        const user = await User_1.User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'user',
        });
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        return {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async login(data) {
        // Find user by email
        const user = await User_1.User.findOne({ email: data.email }).select('+password');
        if (!user) {
            throw new errors_1.AppError(errors_1.errorMessages.INVALID_CREDENTIALS.message, errors_1.errorMessages.INVALID_CREDENTIALS.statusCode);
        }
        // Check password
        const isPasswordValid = await user.comparePassword(data.password);
        if (!isPasswordValid) {
            throw new errors_1.AppError(errors_1.errorMessages.INVALID_CREDENTIALS.message, errors_1.errorMessages.INVALID_CREDENTIALS.statusCode);
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        return {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async getCurrentUser(userId) {
        return User_1.User.findById(userId);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=AuthService.js.map