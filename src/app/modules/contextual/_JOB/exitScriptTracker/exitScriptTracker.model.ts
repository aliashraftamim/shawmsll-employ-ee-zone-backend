import mongoose, { Schema } from "mongoose";
import { IExitScriptTracker } from "./exitScriptTracker.interface";

const ExitScriptTrackerSchema = new Schema<IExitScriptTracker>(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    documents: { type: [String], required: true },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ExitScriptTracker = mongoose.model<IExitScriptTracker>(
  "ExitScriptTracker",
  ExitScriptTrackerSchema
);
