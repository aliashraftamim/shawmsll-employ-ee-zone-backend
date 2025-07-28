/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { IJobSearchTracker } from "./jobSearchTracker.interface";
import { JobSearchTracker } from "./jobSearchTracker.model";

const createJobSearchTracker = async (payload: IJobSearchTracker) => {
  return await JobSearchTracker.create(payload);
};

const getAllJobSearchTracker = async (query: Record<string, any>) => {
  const jobSearchTrackerQuery = new QueryBuilder(
    JobSearchTracker.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await jobSearchTrackerQuery.countTotal();
  const data = await jobSearchTrackerQuery.modelQuery;

  return { meta, data };
};

const getJobSearchTrackerById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await JobSearchTracker.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateJobSearchTracker = async (
  id: string,
  updateData: Partial<IJobSearchTracker>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await JobSearchTracker.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const softDeleteJobSearchTracker = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await JobSearchTracker.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const jobSearchTracker_service = {
  createJobSearchTracker,
  getAllJobSearchTracker,
  getJobSearchTrackerById,
  updateJobSearchTracker,
  softDeleteJobSearchTracker,
};
