// Backend Types
import { Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITask {
  title: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  category: string;
  imageUrl: string;
  userId: string | Document;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  rating?: number;
  reviewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  taskId: string | Document;
  userId: string | Document;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}
export interface ITaskDocument extends ITask, Document {}
export interface IReviewDocument extends IReview, Document {}

export interface IAuthPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ITaskResponse {
  _id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  category: string;
  imageUrl: string;
  userId: string;
  status: string;
  rating?: number;
  reviewCount?: number;
  owner?: {
    name: string;
    email: string;
    avatar?: string;
  };
  reviews?: IReview[];
  createdAt: Date;
  updatedAt: Date;
}
