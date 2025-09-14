import mongoose from "mongoose";

export type TRANSACTION_STATUS =
  | "paid"
  | "expired"
  | "free"
  | "refunded"
  | "canceled"
  | "pending";

export interface ITransaction {
  userId: mongoose.Types.ObjectId;
  stripeSessionId: string;
  stripePaymentIntent: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: TRANSACTION_STATUS;
  isDeleted?: boolean;
}
