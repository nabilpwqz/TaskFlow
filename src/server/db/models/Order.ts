import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  clientId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  packageSnapshot: {
    id: string;
    name: string;
    description: string;
    price: number;
    deliveryDays: number;
    revisions: number;
    features: string[];
  };
  requirements?: string;
  price: number;
  currency: string;
  status:
    | "PENDING_PAYMENT"
    | "IN_PROGRESS"
    | "DELIVERED"
    | "REVISION_REQUESTED"
    | "COMPLETED"
    | "CANCELLED"
    | "DISPUTED"
    | "REFUNDED";
  dueAt: Date;
  deliveries: Array<{
    deliveredAt: Date;
    message: string;
    files: Array<{ name: string; url: string; size?: string }>;
    status: string;
  }>;
  revisionRequests: Array<{
    requestedAt: Date;
    feedback: string;
  }>;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    freelancerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    packageSnapshot: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, default: "" },
      price: { type: Number, required: true },
      deliveryDays: { type: Number, required: true },
      revisions: { type: Number, default: 2 },
      features: { type: [String], default: [] },
    },
    requirements: { type: String, default: "" },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: [
        "PENDING_PAYMENT",
        "IN_PROGRESS",
        "DELIVERED",
        "REVISION_REQUESTED",
        "COMPLETED",
        "CANCELLED",
        "DISPUTED",
        "REFUNDED",
      ],
      default: "IN_PROGRESS",
    },
    dueAt: { type: Date, required: true },
    deliveries: [
      {
        deliveredAt: { type: Date, default: Date.now },
        message: { type: String, required: true },
        files: [{ name: String, url: String, size: String }],
        status: { type: String, default: "submitted" },
      },
    ],
    revisionRequests: [
      {
        requestedAt: { type: Date, default: Date.now },
        feedback: { type: String, required: true },
      },
    ],
    completedAt: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.index({ clientId: 1, status: 1, createdAt: -1 });
OrderSchema.index({ freelancerId: 1, status: 1, createdAt: -1 });
OrderSchema.index({ serviceId: 1 });

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
