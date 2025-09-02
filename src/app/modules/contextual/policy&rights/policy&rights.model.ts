import mongoose, { Schema } from "mongoose";
import { IPolicyRights } from "./policy&rights.interface";

const PolicyRightsSchema = new Schema<IPolicyRights>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PolicyRightsModel = mongoose.model<IPolicyRights>(
  "PolicyRights",
  PolicyRightsSchema
);
