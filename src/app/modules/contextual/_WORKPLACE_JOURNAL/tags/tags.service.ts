import mongoose from "mongoose";
import { ITags } from "./tags.interface";
import { TagsWorkplace } from "./tags.model";

const createTags = async (payload: ITags) => {
  console.log("🚀 ~ createTags ~ payload:", payload);
  return await TagsWorkplace.create(payload);
};

const getAllTags = async () => {
  return await TagsWorkplace.find({ isDeleted: { $ne: true } });
};

const getTagsById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await TagsWorkplace.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateTags = async (id: string, updateData: Partial<ITags>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await TagsWorkplace.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteTags = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await TagsWorkplace.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const tagsService = {
  createTags,
  getAllTags,
  getTagsById,
  updateTags,
  softDeleteTags,
};
