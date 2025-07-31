import mongoose, { Schema } from "mongoose";
import { IGuidanceOnLeavingBenefits } from "./GuidanceOnLeavingBenefits.interface";

const GuidanceOnLeavingBenefitsSchema = new Schema<IGuidanceOnLeavingBenefits>(
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

export const GuidanceOnLeavingBenefits = mongoose.model<IGuidanceOnLeavingBenefits>(
  "GuidanceOnLeavingBenefits",
  GuidanceOnLeavingBenefitsSchema
);
