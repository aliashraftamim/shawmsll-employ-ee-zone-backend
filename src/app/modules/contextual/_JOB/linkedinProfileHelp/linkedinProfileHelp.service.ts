/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { ILinkedinProfileHelp } from "./linkedinProfileHelp.interface";
import { LinkedinProfileHelp } from "./linkedinProfileHelp.model";

const createLinkedinProfileHelp = async (payload: ILinkedinProfileHelp) => {
  return await LinkedinProfileHelp.create(payload);
};

const getAllLinkedinProfileHelp = async (query: Record<string, any>) => {
  const linkedinProfileHelpQuery = new QueryBuilder(
    LinkedinProfileHelp.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await linkedinProfileHelpQuery.countTotal();
  const data = await linkedinProfileHelpQuery.modelQuery;

  return { meta, data };
};

const getLinkedinProfileHelpById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await LinkedinProfileHelp.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
};

const updateLinkedinProfileHelp = async (
  id: string,
  updateData: Partial<ILinkedinProfileHelp>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await LinkedinProfileHelp.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const softDeleteLinkedinProfileHelp = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await LinkedinProfileHelp.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const linkedinProfileHelp_service = {
  createLinkedinProfileHelp,
  getAllLinkedinProfileHelp,
  getLinkedinProfileHelpById,
  updateLinkedinProfileHelp,
  softDeleteLinkedinProfileHelp,
};
