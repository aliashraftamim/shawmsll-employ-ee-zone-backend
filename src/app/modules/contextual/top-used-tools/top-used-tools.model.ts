import mongoose, { Schema } from "mongoose";
import { ITopUsedTools } from "./top-used-tools.interface";

const TopUsedToolsSchema = new Schema<ITopUsedTools>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    priority: { type: Number, required: true },
    matchField: { type: String, required: true },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const TopUsedTools = mongoose.model<ITopUsedTools>(
  "TopUsedTools",
  TopUsedToolsSchema
);
