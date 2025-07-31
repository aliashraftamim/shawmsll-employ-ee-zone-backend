/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { IResumeTips } from "./resumeTips.interface";
import { ResumeTips } from "./resumeTips.model";

const createResumeTips = async (payload: IResumeTips) => {
  return await ResumeTips.create(payload);
};

const getAllResumeTips = async (query: Record<string, any>) => {
  const resumeTipsQuery = new QueryBuilder(
    ResumeTips.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await resumeTipsQuery.countTotal();
  const data = await resumeTipsQuery.modelQuery;

  return { meta, data };
};

const getResumeTipsById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ResumeTips.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateResumeTips = async (
  id: string,
  updateData: Partial<IResumeTips>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ResumeTips.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteResumeTips = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ResumeTips.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const resumeTips_service = {
  createResumeTips,
  getAllResumeTips,
  getResumeTipsById,
  updateResumeTips,
  softDeleteResumeTips,
};
