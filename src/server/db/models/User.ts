import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "client" | "freelancer" | "admin";
  username: string;
  avatar?: string;
  status: "active" | "suspended" | "pending";
  bio?: string;
  skills: string[];
  hourlyRate?: number;
  rating: number;
  reviewCount: number;
  completedOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["client", "freelancer", "admin"], default: "client" },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String, default: "" },
    status: { type: String, enum: ["active", "suspended", "pending"], default: "active" },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    hourlyRate: { type: Number, default: 45 },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ role: 1 });

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
