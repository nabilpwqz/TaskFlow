// User Model
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IUserDocument } from '../types';

export interface IUserDocumentMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type IUserDocumentWithMethods = IUserDocument & IUserDocumentMethods;

const UserSchema = new Schema<IUserDocumentWithMethods>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = this.password ? await bcrypt.hash(this.password, salt) : '';
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return this.password ? bcrypt.compare(password, this.password) : false;
};

export const User = mongoose.model<IUserDocumentWithMethods>('User', UserSchema);

// Export for backward compatibility
export type { IUserDocumentWithMethods as IUserDocument };
