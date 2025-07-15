import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { ICommunicationToolkit } from "./communicationToolkit.interface";
import { CommunicationToolkit } from "./communicationToolkit.model";

// Create
const createToolkit = async (payload: ICommunicationToolkit) => {
  return await CommunicationToolkit.create(payload);
};

// Get all (only not deleted)
const getAllToolkit = async (query: Record<string, unknown>) => {
  const toolkitQuery = new QueryBuilder(
    CommunicationToolkit.find({ isDeleted: false }),
    query
  )
    .search(["title", "message"]) // 🔍 searchable fields
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await toolkitQuery.countTotal();
  const data = await toolkitQuery.modelQuery;

  return {
    meta,
    data,
  };
};

// Update
const updateToolkit = async (
  id: mongoose.Types.ObjectId,
  payload: Partial<ICommunicationToolkit>
) => {
  return await CommunicationToolkit.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true }
  );
};

// Soft Delete
const deleteToolkit = async (id: mongoose.Types.ObjectId) => {
  return await CommunicationToolkit.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
};

export const communicationToolkit_service = {
  createToolkit,
  getAllToolkit,
  updateToolkit,
  deleteToolkit,
};
