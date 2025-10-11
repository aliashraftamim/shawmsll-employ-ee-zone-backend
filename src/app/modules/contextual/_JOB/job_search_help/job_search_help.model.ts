import mongoose, { Schema } from "mongoose";
import { IJobSearchHelp } from "./job_search_help.interface";

const JobSearchHelpSchema = new Schema<IJobSearchHelp>(
  {
    icon: { type: String, required: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    documents: { type: [String], default: [] },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const JobSearchHelp = mongoose.model<IJobSearchHelp>(
  "JobSearchHelp",
  JobSearchHelpSchema
);
