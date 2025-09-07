import mongoose from "mongoose";

export interface ISpecialistSchedule {
  user: mongoose.Types.ObjectId;
  specialist: mongoose.Types.ObjectId;
  scheduleAt: Date;

  isDeleted?: boolean;
}
