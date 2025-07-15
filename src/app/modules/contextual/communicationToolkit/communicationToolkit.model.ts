import mongoose, { model } from "mongoose";
import { ICommunicationToolkit } from "./communicationToolkit.interface";

const communicationToolkitSchema = new mongoose.Schema<ICommunicationToolkit>(
  {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    tone: {
      type: [String],
      default: [],
      required: true,
    },
    message: {
      type: String,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CommunicationToolkit = model<ICommunicationToolkit>(
  "CommunicationToolkit",
  communicationToolkitSchema
);
