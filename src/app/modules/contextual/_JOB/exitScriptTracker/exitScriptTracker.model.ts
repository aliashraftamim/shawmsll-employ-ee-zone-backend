import mongoose, { Schema } from "mongoose";
import { IExitScriptTracker } from "./exitScriptTracker.interface";

const ExitScriptTrackerSchema = new Schema<IExitScriptTracker>(
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

export const ExitScriptTracker = mongoose.model<IExitScriptTracker>(
  "ExitScriptTracker",
  ExitScriptTrackerSchema
);
