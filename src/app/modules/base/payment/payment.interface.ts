import mongoose from "mongoose";

export interface IPayment {
  paymentId: string;
  sessionId: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "expired" | "free" | "refunded" | "canceled";

  subscriptionId: mongoose.Types.ObjectId;

  isDeleted?: boolean;
}
