/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { ICommunicationToolkitCategory } from "./communicationToolkitCategory.interface";
import { CommunicationToolkitCategory } from "./communicationToolkitCategory.model";

const createCommunicationToolkitCategory = async (
  payload: ICommunicationToolkitCategory
) => {
  return await CommunicationToolkitCategory.create(payload);
};

const getAllCommunicationToolkitCategory = async (
  Query: Record<string, any>
) => {
  const ctCategoryQuery = new QueryBuilder(
    CommunicationToolkitCategory.find({ isDeleted: { $ne: true } }),
    Query
  )
    .search(["title"])
    .sort()
    .paginate()
    .fields();

  const meta = await ctCategoryQuery.countTotal();
  const data = await ctCategoryQuery.modelQuery;

  return { meta, data };
};

const getCommunicationToolkitCategoryById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await CommunicationToolkitCategory.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
};

const updateCommunicationToolkitCategory = async (
  id: string,
  updateData: Partial<ICommunicationToolkitCategory>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await CommunicationToolkitCategory.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const softDeleteCommunicationToolkitCategory = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await CommunicationToolkitCategory.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const communicationToolkitCategoryService = {
  createCommunicationToolkitCategory,
  getAllCommunicationToolkitCategory,
  getCommunicationToolkitCategoryById,
  updateCommunicationToolkitCategory,
  softDeleteCommunicationToolkitCategory,
};
