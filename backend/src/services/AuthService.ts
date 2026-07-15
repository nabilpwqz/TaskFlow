// Auth Service
import { User, IUserDocument } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AppError, errorMessages } from '../utils/errors';
import { RegisterInput, LoginInput } from '../utils/validation';

export class AuthService {
  async register(data: RegisterInput): Promise<{ token: string; user: any }> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError(
        errorMessages.EMAIL_ALREADY_EXISTS.message,
        errorMessages.EMAIL_ALREADY_EXISTS.statusCode
      );
    }

    // Create new user
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
    });

    // Generate token
    const token = generateToken({
      userId: user._id!.toString(),
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

  async login(data: LoginInput): Promise<{ token: string; user: any }> {
    // Find user by email
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user) {
      throw new AppError(
        errorMessages.INVALID_CREDENTIALS.message,
        errorMessages.INVALID_CREDENTIALS.statusCode
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new AppError(
        errorMessages.INVALID_CREDENTIALS.message,
        errorMessages.INVALID_CREDENTIALS.statusCode
      );
    }

    // Generate token
    const token = generateToken({
      userId: user._id!.toString(),
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

  async getCurrentUser(userId: string): Promise<IUserDocument | null> {
    return User.findById(userId);
  }
}

export const authService = new AuthService();
