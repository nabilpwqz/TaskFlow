"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
// JWT Configuration
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    cookieName: 'token',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    },
};
//# sourceMappingURL=jwt.js.map