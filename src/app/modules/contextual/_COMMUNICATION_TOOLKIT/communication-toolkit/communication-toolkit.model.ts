import mongoose, { Schema } from "mongoose";
import { ICommunicationToolkit } from "./communication-toolkit.interface";

const CommunicationToolkitSchema = new Schema<ICommunicationToolkit>(
  {
    tone: { type: [String], required: true },
    message: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CommunicationToolkit = mongoose.model<ICommunicationToolkit>(
  "CommunicationToolkit",
  CommunicationToolkitSchema
);
