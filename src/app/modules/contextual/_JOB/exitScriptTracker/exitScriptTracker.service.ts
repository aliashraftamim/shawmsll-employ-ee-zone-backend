/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { IExitScriptTracker } from "./exitScriptTracker.interface";
import { ExitScriptTracker } from "./exitScriptTracker.model";

const createExitScriptTracker = async (payload: IExitScriptTracker) => {
  return await ExitScriptTracker.create(payload);
};

const getAllExitScriptTracker = async (query: Record<string, any>) => {
  const exitScriptTrackerQuery = new QueryBuilder(
    ExitScriptTracker.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await exitScriptTrackerQuery.countTotal();
  const data = await exitScriptTrackerQuery.modelQuery;

  return { meta, data };
};

const getExitScriptTrackerById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ExitScriptTracker.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateExitScriptTracker = async (
  id: string,
  updateData: Partial<IExitScriptTracker>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ExitScriptTracker.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const softDeleteExitScriptTracker = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ExitScriptTracker.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const exitScriptTracker_service = {
  createExitScriptTracker,
  getAllExitScriptTracker,
  getExitScriptTrackerById,
  updateExitScriptTracker,
  softDeleteExitScriptTracker,
};
