// Review Model
import mongoose, { Schema } from 'mongoose';
import { IReview, IReviewDocument } from '../types';

const ReviewSchema = new Schema<IReviewDocument>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment must not exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique review per user per task
ReviewSchema.index({ taskId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model<IReviewDocument>('Review', ReviewSchema);

// Export for backward compatibility
export type { IReviewDocument };
