import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServicePackage {
  id: "basic" | "standard" | "premium";
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
}

export interface IService extends Document {
  sellerId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  tags: string[];
  packages: IServicePackage[];
  images: string[];
  coverImage: string;
  status: "published" | "draft" | "paused";
  rating: number;
  reviewCount: number;
  completedOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServicePackageSchema = new Schema<IServicePackage>({
  id: { type: String, enum: ["basic", "standard", "premium"], required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 5 },
  deliveryDays: { type: Number, required: true, min: 1 },
  revisions: { type: Number, default: 2 },
  features: { type: [String], default: [] },
});

const ServiceSchema = new Schema<IService>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDesc: { type: String, required: true },
    fullDesc: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    packages: { type: [ServicePackageSchema], required: true },
    images: { type: [String], default: [] },
    coverImage: { type: String, required: true },
    status: { type: String, enum: ["published", "draft", "paused"], default: "published" },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ServiceSchema.index({ slug: 1 }, { unique: true });
ServiceSchema.index({ status: 1, category: 1, createdAt: -1 });
ServiceSchema.index({ sellerId: 1, status: 1 });
ServiceSchema.index({ title: "text", shortDesc: "text", fullDesc: "text", tags: "text" });

export const ServiceModel: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
