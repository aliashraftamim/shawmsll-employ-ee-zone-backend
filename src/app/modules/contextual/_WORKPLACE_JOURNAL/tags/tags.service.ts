/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { ITags } from "./tags.interface";
import { TagsWorkplace } from "./tags.model";

const createTags = async (payload: ITags) => {
  return await TagsWorkplace.create(payload);
};

const getAllTags = async (query: Record<string, any>) => {
  const tagsQuery = new QueryBuilder(
    TagsWorkplace.find({ isDeleted: { $ne: true } }),
    query
  )
    .search(["tag"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await tagsQuery.countTotal();
  const data = await tagsQuery.modelQuery;

  return { meta, data };
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
