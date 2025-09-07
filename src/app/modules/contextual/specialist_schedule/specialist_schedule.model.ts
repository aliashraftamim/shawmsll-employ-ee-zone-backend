import mongoose, { Schema } from "mongoose";
import { ISpecialistSchedule } from "./specialist_schedule.interface";

const SpecialistScheduleSchema = new Schema<ISpecialistSchedule>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    specialist: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scheduleAt: { type: Date, required: true },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SpecialistSchedule = mongoose.model<ISpecialistSchedule>(
  "SpecialistSchedule",
  SpecialistScheduleSchema
);
