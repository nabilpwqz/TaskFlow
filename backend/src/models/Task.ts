// Task Model
import mongoose, { Schema } from 'mongoose';
import { ITask, ITaskDocument } from '../types';

const TaskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    shortDesc: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [300, 'Short description must not exceed 300 characters'],
    },
    fullDesc: {
      type: String,
      required: [true, 'Full description is required'],
      minlength: [20, 'Full description must be at least 20 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least $1'],
      max: [500000, 'Price must not exceed $500,000'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Web Development', 'Graphic Design', 'Content Writing', 'Digital Marketing', 'Other'],
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
TaskSchema.index({ title: 'text', shortDesc: 'text', fullDesc: 'text' });
TaskSchema.index({ category: 1, status: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });

export const Task = mongoose.model<ITaskDocument>('Task', TaskSchema);

// Export for backward compatibility
export type { ITaskDocument };
