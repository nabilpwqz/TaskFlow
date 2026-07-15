// Frontend Types

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  _id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  category: string;
  imageUrl: string;
  userId: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
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

export interface IReview {
  _id: string;
  taskId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}

export interface ITasksResponse {
  items: ITask[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ITaskFilters {
  search: string;
  category: string;
  sort: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  page: number;
  limit: number;
}
