import mongoose, { Schema } from "mongoose";
import { IInterviewPrep } from "./interviewPrep.interface";

const InterviewPrepSchema = new Schema<IInterviewPrep>(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    documents: { type: [String], required: true },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const InterviewPrep = mongoose.model<IInterviewPrep>(
  "InterviewPrep",
  InterviewPrepSchema
);
