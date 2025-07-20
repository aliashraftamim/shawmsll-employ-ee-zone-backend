import mongoose, { Schema } from "mongoose";
import { ITags } from "./tags.interface";

const TagsSchema = new Schema<ITags>(
  {
    tag: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const TagsWorkplace = mongoose.model<ITags>("TagsWorkplace", TagsSchema);
