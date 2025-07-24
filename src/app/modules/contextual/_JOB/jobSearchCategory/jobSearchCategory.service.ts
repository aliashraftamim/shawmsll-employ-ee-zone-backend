/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { IJobSearchCategory } from "./jobSearchCategory.interface";
import { JobSearchCategory } from "./jobSearchCategory.model";

const createJobSearchCategory = async (payload: IJobSearchCategory) => {
  return await JobSearchCategory.create(payload);
};

const getAllJobSearchCategory = async (query: Record<string, any>) => {
  const jobSearchCategoryQuery = new QueryBuilder(
    JobSearchCategory.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await jobSearchCategoryQuery.countTotal();
  const data = await jobSearchCategoryQuery.modelQuery;

  return { meta, data };
};

const getJobSearchCategoryById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await JobSearchCategory.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateJobSearchCategory = async (
  id: string,
  updateData: Partial<IJobSearchCategory>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await JobSearchCategory.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const softDeleteJobSearchCategory = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await JobSearchCategory.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const jobSearchCategoryService = {
  createJobSearchCategory,
  getAllJobSearchCategory,
  getJobSearchCategoryById,
  updateJobSearchCategory,
  softDeleteJobSearchCategory,
};
