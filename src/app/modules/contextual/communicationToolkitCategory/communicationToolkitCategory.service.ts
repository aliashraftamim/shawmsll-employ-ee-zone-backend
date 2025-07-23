import mongoose from "mongoose";
import { ICommunicationToolkitCategory } from "./communicationToolkitCategory.interface";
import { CommunicationToolkitCategory } from "./communicationToolkitCategory.model";

const createCommunicationToolkitCategory = async (
  payload: ICommunicationToolkitCategory
) => {
  return await CommunicationToolkitCategory.create(payload);
};

const getAllCommunicationToolkitCategory = async () => {
  return await CommunicationToolkitCategory.find({ isDeleted: { $ne: true } });
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
