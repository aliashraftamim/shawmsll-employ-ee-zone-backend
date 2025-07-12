import { model, Schema } from "mongoose";
import { IGuidance } from "./guidance.interface";

const guidanceSchema = new Schema<IGuidance>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "GCategory",
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
