/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { IPayment } from "./payment.interface";
import { Payment } from "./payment.model";

class PaymentService {
  async createPayment(payload: IPayment) {
    return await Payment.create(payload);
  }

  async getAllPayment(query: Record<string, any>) {
    const paymentQuery = new QueryBuilder(
      Payment.find({
        isDeleted: { $ne: true },
      }),
      query
    )
      .search([])
      .sort()
      .paginate()
      .fields();

    const meta = await paymentQuery.countTotal();
    const data = await paymentQuery.modelQuery;

    return { meta, data };
  }

  async getPaymentById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await Payment.findOne({ _id: id, isDeleted: { $ne: true } });
  }

  async updatePayment(id: string, updateData: Partial<IPayment>) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await Payment.findByIdAndUpdate(id, updateData, { new: true });
  }

  async softDeletePayment(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await Payment.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}

export const payment_service = new PaymentService();
