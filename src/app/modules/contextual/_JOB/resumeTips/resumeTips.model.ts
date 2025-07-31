import mongoose, { Schema } from "mongoose";
import { IResumeTips } from "./resumeTips.interface";

const ResumeTipsSchema = new Schema<IResumeTips>(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    documents: { type: [String], required: true },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ResumeTips = mongoose.model<IResumeTips>(
  "ResumeTips",
  ResumeTipsSchema
);
