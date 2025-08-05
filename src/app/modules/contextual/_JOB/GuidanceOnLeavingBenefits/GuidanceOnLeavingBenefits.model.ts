import mongoose, { Schema } from "mongoose";
import { IGuidanceOnLeavingBenefits } from "./GuidanceOnLeavingBenefits.interface";

const GuidanceOnLeavingBenefitsSchema = new Schema<IGuidanceOnLeavingBenefits>(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    documents: { type: [String], required: true },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GuidanceOnLeavingBenefits =
  mongoose.model<IGuidanceOnLeavingBenefits>(
    "GuidanceOnLeavingBenefits",
    GuidanceOnLeavingBenefitsSchema
  );
