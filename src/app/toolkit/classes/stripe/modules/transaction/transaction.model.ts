import mongoose, { Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    stripeSessionId: { type: String, required: true },
    stripePaymentIntent: { type: String, required: true },
    subscriptionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["paid", "expired", "free", "refunded", "canceled", "pending"],
      default: "pending",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
