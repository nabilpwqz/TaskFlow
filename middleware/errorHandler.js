"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../utils/errors");
const zod_1 = require("zod");
function errorHandler(error, req, res, next) {
    console.error('Error:', error);
    if (error instanceof zod_1.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        res.status(400).json({
            error: errors_1.errorMessages.VALIDATION_ERROR.message,
            details: messages,
        });
        return;
    }
    if (error instanceof errors_1.AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
    }
    // MongoDB errors
    if (error.name === 'CastError') {
        res.status(400).json({ error: 'Invalid ID format' });
        return;
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        res.status(409).json({ error: `${field} already exists` });
        return;
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors)
            .map((e) => e.message)
            .join(', ');
        res.status(400).json({ error: messages });
        return;
    }
    // Default error
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? errors_1.errorMessages.INTERNAL_SERVER_ERROR.message
            : error.message
    });
}
//# sourceMappingURL=errorHandler.js.map