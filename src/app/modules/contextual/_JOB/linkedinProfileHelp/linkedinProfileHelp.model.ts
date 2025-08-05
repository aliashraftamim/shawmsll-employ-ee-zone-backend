import mongoose, { Schema } from "mongoose";
import { ILinkedinProfileHelp } from "./linkedinProfileHelp.interface";

const LinkedinProfileHelpSchema = new Schema<ILinkedinProfileHelp>(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    documents: { type: [String], required: true },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const LinkedinProfileHelp = mongoose.model<ILinkedinProfileHelp>(
  "LinkedinProfileHelp",
  LinkedinProfileHelpSchema
);
