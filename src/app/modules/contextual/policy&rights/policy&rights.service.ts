import mongoose from "mongoose";
import { IPolicyRights } from "./policy&rights.interface";
import { PolicyRightsModel } from "./policy&rights.model";

const createPolicyRights = async (payload: IPolicyRights) => {
  return await PolicyRightsModel.create(payload);
};

const getAllPolicyRights = async () => {
  return await PolicyRightsModel.find({ isDeleted: { $ne: true } });
};

const getPolicyRightsById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await PolicyRightsModel.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
};

const updatePolicyRights = async (
  id: string,
  updateData: Partial<IPolicyRights>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await PolicyRightsModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const softDeletePolicyRights = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await PolicyRightsModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const PolicyRightsService = {
  createPolicyRights,
  getAllPolicyRights,
  getPolicyRightsById,
  updatePolicyRights,
  softDeletePolicyRights,
};
