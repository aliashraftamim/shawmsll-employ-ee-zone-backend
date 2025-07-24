import mongoose, { Schema } from "mongoose";
import { IJobSearchCategory } from "./jobSearchCategory.interface";

const JobSearchCategorySchema = new Schema<IJobSearchCategory>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "archived", "pending"],
      default: "active",
    },
    doc: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const JobSearchCategory = mongoose.model<IJobSearchCategory>(
  "JobSearchCategory",
  JobSearchCategorySchema
);
