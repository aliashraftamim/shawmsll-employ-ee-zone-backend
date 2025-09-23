/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { IScheduleType } from "./scheduleType.interface";
import { ScheduleType } from "./scheduleType.model";

const createScheduleType = async (payload: IScheduleType) => {
  return await ScheduleType.create(payload);
};

const getAllScheduleType = async (query: Record<string, any>) => {
  const scheduleTypeQuery = new QueryBuilder(
    ScheduleType.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search(["name"])
    .sort()
    .paginate()
    .fields();

  const meta = await scheduleTypeQuery.countTotal();
  const data = await scheduleTypeQuery.modelQuery;

  return { meta, data };
};

const getScheduleTypeById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ScheduleType.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateScheduleType = async (
  id: string,
  updateData: Partial<IScheduleType>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ScheduleType.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteScheduleType = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ScheduleType.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const scheduleType_service = {
  createScheduleType,
  getAllScheduleType,
  getScheduleTypeById,
  updateScheduleType,
  softDeleteScheduleType,
};
