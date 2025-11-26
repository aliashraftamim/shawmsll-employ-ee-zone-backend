import mongoose, { Schema } from "mongoose";
import { IPolicyRights } from "./policy&rights.interface";

const PolicyRightsSchema = new Schema<IPolicyRights>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, enum: ["federal-law", "state"], required: true },
    federalLaw: {
      policyLaw: { type: String, default: "" },
      content: { type: String, default: "" },
    },
    state: {
      stateName: { type: String, default: "" },
      stateTitle: { type: String, default: "" },
      content: { type: String, default: "" },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PolicyRightsModel = mongoose.model<IPolicyRights>(
  "PolicyRights",
  PolicyRightsSchema
);
