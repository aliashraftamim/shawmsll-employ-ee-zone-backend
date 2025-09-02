import mongoose, { Schema } from "mongoose";
import { ICtTemplate } from "./ctTemplate.interface";

const CtTemplateSchema = new Schema<ICtTemplate>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    message: { type: String, required: true },
    tone: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ["active", "inactive", "archived", "pending"],
      default: "active",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CtTemplate = mongoose.model<ICtTemplate>(
  "CtTemplate",
  CtTemplateSchema
);
