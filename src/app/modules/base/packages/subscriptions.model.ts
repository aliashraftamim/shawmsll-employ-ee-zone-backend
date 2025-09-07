import { model, Schema } from "mongoose";
import { ISubscription } from "./subscriptions.interface";

const subscriptionSchema = new Schema<ISubscription>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    features: [
      {
        title: { type: String, default: null },
        active: { type: Boolean, default: true },
      },
    ],
    services: [{ type: String, default: null }],
    duration: {
      type: Number,
      required: true,
    },
    isOneTime: {
      type: Boolean,
      default: false,
    },
    durationType: {
      type: String,
      enum: ["monthly", "free", "oneTime"],
      default: "monthly",
    },
    type: {
      type: String,
      enum: ["basic", "premium", "advanced"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Subscription = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
