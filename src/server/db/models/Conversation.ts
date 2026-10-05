import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  orderId?: mongoose.Types.ObjectId;
  participantIds: mongoose.Types.ObjectId[];
  lastMessage?: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    participantIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ConversationSchema.index({ participantIds: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

export const ConversationModel: Model<IConversation> =
  mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);
