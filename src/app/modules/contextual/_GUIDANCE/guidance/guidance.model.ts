import { model, Schema, Types } from "mongoose";
import { IGuidance } from "./guidance.interface";

const guidanceSchema = new Schema<IGuidance>(
  {
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    scenario: {
      type: String,
      required: true,
    },
    guidance: {
      type: String,
      required: true,
    },

    tips: {
      type: [String],
      default: [],
    },

    suggestedScript: {
      type: String,
      required: true,
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

export const Guidance = model<IGuidance>("Guidance", guidanceSchema);
