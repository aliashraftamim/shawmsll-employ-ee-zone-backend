import mongoose, { Schema } from "mongoose";
import { ILinkedinProfileHelp } from "./linkedinProfileHelp.interface";

const LinkedinProfileHelpSchema = new Schema<ILinkedinProfileHelp>(
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

export const LinkedinProfileHelp = mongoose.model<ILinkedinProfileHelp>(
  "LinkedinProfileHelp",
  LinkedinProfileHelpSchema
);
