"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.adminMiddleware = adminMiddleware;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const User_1 = require("../models/User");
async function authMiddleware(req, res, next) {
    try {
        // Get token from cookie or Authorization header
        let token = req.cookies?.token;
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7);
        }
        if (!token) {
            throw new errors_1.AppError(errors_1.errorMessages.UNAUTHORIZED.message, errors_1.errorMessages.UNAUTHORIZED.statusCode);
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            throw new errors_1.AppError(errors_1.errorMessages.INVALID_TOKEN.message, errors_1.errorMessages.INVALID_TOKEN.statusCode);
        }
        // Verify user still exists
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            throw new errors_1.AppError(errors_1.errorMessages.USER_NOT_FOUND.message, errors_1.errorMessages.USER_NOT_FOUND.statusCode);
        }
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        req.token = token;
        next();
    }
    catch (error) {
        if (error instanceof errors_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
        }
        else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
}
function adminMiddleware(req, res, next) {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden - Admin access required' });
        return;
    }
    next();
}
//# sourceMappingURL=auth.js.map