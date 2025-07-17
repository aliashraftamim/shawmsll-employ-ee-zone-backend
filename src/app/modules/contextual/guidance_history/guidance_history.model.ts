import { Schema, model } from "mongoose";
import { IGuidanceHist } from "./guidance_history.interface";

const allHistorySchema = new Schema<IGuidanceHist>(
  {
    category: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
    guidance: { type: String, required: true },
    tips: [{ type: String }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Guidance_history = model<IGuidanceHist>(
  "Guidance_history",
  allHistorySchema
);
