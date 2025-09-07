import mongoose, { Schema } from "mongoose";
import { IScheduleType } from "./scheduleType.interface";

const ScheduleTypeSchema = new Schema<IScheduleType>(
  {
    name: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ScheduleType = mongoose.model<IScheduleType>(
  "ScheduleType",
  ScheduleTypeSchema
);
