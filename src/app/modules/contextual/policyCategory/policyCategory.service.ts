import mongoose from "mongoose";
import { IPolicyCategory } from "./policyCategory.interface";
import { PolicyCategoryModel } from "./policyCategory.model";

const createPolicyCategory = async (payload: IPolicyCategory) => {
  return await PolicyCategoryModel.create(payload);
};

const getAllPolicyCategory = async () => {
  return await PolicyCategoryModel.find({ isDeleted: { $ne: true } });
};

const getPolicyCategoryById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await PolicyCategoryModel.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updatePolicyCategory = async (
  id: string,
  updateData: Partial<IPolicyCategory>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await PolicyCategoryModel.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeletePolicyCategory = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await PolicyCategoryModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const policyCategoryService = {
  createPolicyCategory,
  getAllPolicyCategory,
  getPolicyCategoryById,
  updatePolicyCategory,
  softDeletePolicyCategory,
};
