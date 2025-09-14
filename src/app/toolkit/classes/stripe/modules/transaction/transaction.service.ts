/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../../core/builders/QueryBuilder";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const createTransaction = async (payload: ITransaction) => {
  return await Transaction.create(payload);
};

const getAllTransaction = async (query: Record<string, any>) => {
  const transactionQuery = new QueryBuilder(
    Transaction.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await transactionQuery.countTotal();
  const data = await transactionQuery.modelQuery;

  return { meta, data };
};

const getTransactionById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await Transaction.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateTransaction = async (
  id: string,
  updateData: Partial<ITransaction>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await Transaction.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteTransaction = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await Transaction.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const transaction_service = {
  createTransaction,
  getAllTransaction,
  getTransactionById,
  updateTransaction,
  softDeleteTransaction,
};
