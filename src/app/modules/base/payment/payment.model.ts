import mongoose, { Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const PaymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, default: null },
    sessionId: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["paid", "pending", "expired", "free", "refunded", "canceled"],
      required: true,
    },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
