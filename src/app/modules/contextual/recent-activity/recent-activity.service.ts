/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import AppError from "../../../core/error/AppError";
import { IRecentActivity } from "./recent-activity.interface";
import { RecentActivity } from "./recent-activity.model";

const createRecentActivity = async (payload: IRecentActivity) => {
  return await RecentActivity.create(payload);
};

const getAllRecentActivity = async (query: Record<string, any>) => {
  if (query.user) {
    if (!mongoose.Types.ObjectId.isValid(query.user)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid User ID");
    }
  }

  const recentActivityQuery = new QueryBuilder(
    RecentActivity.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await recentActivityQuery.countTotal();
  const data = await recentActivityQuery.modelQuery;

  return { meta, data };
};

const getRecentActivityById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await RecentActivity.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateRecentActivity = async (
  id: string,
  updateData: Partial<IRecentActivity>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await RecentActivity.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteRecentActivity = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await RecentActivity.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const recentActivity_service = {
  createRecentActivity,
  getAllRecentActivity,
  getRecentActivityById,
  updateRecentActivity,
  softDeleteRecentActivity,
};
