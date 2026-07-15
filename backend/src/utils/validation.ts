// Validation Schemas
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createTaskSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  shortDesc: z.string().min(1, 'Short description is required').max(300),
  fullDesc: z.string().min(20, 'Full description must be at least 20 characters'),
  price: z.number().min(1, 'Price must be at least $1').max(500000),
  category: z.enum(['Web Development', 'Graphic Design', 'Content Writing', 'Digital Marketing', 'Other']),
  imageUrl: z.string().url().optional().default('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop'),
});

export const updateTaskSchema = createTaskSchema.partial();

export const createReviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be between 1 and 5').max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
