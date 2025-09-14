import mongoose from "mongoose";

export interface IPayment {
  userId: mongoose.Types.ObjectId;
  subscriptionId: mongoose.Types.ObjectId;

  paymentId: string;
  sessionId: string;
  amount: number;
  currency: string;

  status: "paid" | "pending" | "expired" | "free" | "refunded" | "canceled";
  isDeleted?: boolean;
}
