export type UserRole = "client" | "freelancer" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  username: string;
  avatar?: string;
  status: "active" | "suspended" | "pending";
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  rating?: number;
  reviewCount?: number;
  completedOrders?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePackage {
  id: "basic" | "standard" | "premium";
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
}

export interface Service {
  _id: string;
  sellerId: string;
  seller?: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
    rating?: number;
    reviewCount?: number;
  };
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  tags: string[];
  packages: ServicePackage[];
  images: string[];
  coverImage: string;
  status: "published" | "draft" | "paused";
  rating: number;
  reviewCount: number;
  completedOrders: number;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "REVISION_REQUESTED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED"
  | "REFUNDED";

export interface OrderDelivery {
  deliveredAt: string;
  message: string;
  files: Array<{ name: string; url: string; size?: string }>;
  status: "submitted" | "revision_requested" | "approved";
}

export interface Order {
  _id: string;
  clientId: string;
  freelancerId: string;
  serviceId: string;
  client?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  freelancer?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  service?: {
    _id: string;
    title: string;
    coverImage: string;
    category: string;
  };
  packageSnapshot: ServicePackage;
  requirements?: string;
  price: number;
  currency: string;
  status: OrderStatus;
  dueAt: string;
  deliveries: OrderDelivery[];
  revisionRequests: Array<{
    requestedAt: string;
    feedback: string;
  }>;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  orderId: string;
  clientId: string;
  freelancerId: string;
  serviceId: string;
  client?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  moderationStatus: "approved" | "pending" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  body: string;
  attachments?: Array<{ name: string; url: string }>;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  orderId?: string;
  participantIds: string[];
  participants?: User[];
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "order" | "message" | "review" | "system";
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}
