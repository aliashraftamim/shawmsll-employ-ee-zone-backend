import mongoose, { Schema } from "mongoose";
import { IJobSearchTracker } from "./jobSearchTracker.interface";

const JobSearchTrackerSchema = new Schema<IJobSearchTracker>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },  
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "archived", "pending"],
      default: "active",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const JobSearchTracker = mongoose.model<IJobSearchTracker>(
  "JobSearchTracker",
  JobSearchTrackerSchema
);
