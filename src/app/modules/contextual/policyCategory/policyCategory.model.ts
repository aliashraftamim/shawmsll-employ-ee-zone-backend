import mongoose, { Schema } from "mongoose";
import { IPolicyCategory } from "./policyCategory.interface";

const PolicyCategorySchema = new Schema<IPolicyCategory>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PolicyCategoryModel = mongoose.model<IPolicyCategory>(
  "PolicyCategory",
  PolicyCategorySchema
);
