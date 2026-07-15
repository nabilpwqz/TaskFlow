// Error Handler
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorMessages = {
  // Auth errors
  INVALID_CREDENTIALS: { message: 'Invalid email or password', statusCode: 401 },
  EMAIL_ALREADY_EXISTS: { message: 'Email already registered', statusCode: 409 },
  UNAUTHORIZED: { message: 'Unauthorized - Please login', statusCode: 401 },
  INVALID_TOKEN: { message: 'Invalid or expired token', statusCode: 401 },
  
  // Task errors
  TASK_NOT_FOUND: { message: 'Task not found', statusCode: 404 },
  TASK_PERMISSION_DENIED: { message: 'You do not have permission to modify this task', statusCode: 403 },
  
  // Review errors
  REVIEW_NOT_FOUND: { message: 'Review not found', statusCode: 404 },
  DUPLICATE_REVIEW: { message: 'You have already reviewed this task', statusCode: 409 },
  
  // User errors
  USER_NOT_FOUND: { message: 'User not found', statusCode: 404 },
  
  // Validation errors
  VALIDATION_ERROR: { message: 'Validation failed', statusCode: 400 },
  
  // Server errors
  INTERNAL_SERVER_ERROR: { message: 'Internal server error', statusCode: 500 },
};
