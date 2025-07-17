import { Types } from "mongoose";
import { IGuidanceHist } from "./guidance_history.interface";
import { GuidHist } from "./guidance_history.model";

// Create new guidance history
const createGuiHist = async (payload: IGuidanceHist) => {
  return await GuidHist.create(payload);
};

// Get all guidance histories (exclude soft deleted)
const getAllGuiHist = async () => {
  return await GuidHist.find({ isDeleted: { $ne: true } });
};

// Get single guidance history by id (exclude soft deleted)
const getGuiHistById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await GuidHist.findOne({ _id: id, isDeleted: { $ne: true } });
};

// Update guidance history by id
const updateGuiHist = async (
  id: string,
  updateData: Partial<IGuidanceHist>
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await GuidHist.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

// Soft delete by setting isDeleted = true
const softDeleteGuiHist = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await GuidHist.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const GuidHist_service = {
  createGuiHist,
  getAllGuiHist,
  getGuiHistById,
  updateGuiHist,
  softDeleteGuiHist,
};
