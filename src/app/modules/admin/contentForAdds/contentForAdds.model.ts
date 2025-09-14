import mongoose, { Schema } from "mongoose";
import { IContentForAdds } from "./contentForAdds.interface";

const ContentForAddsSchema = new Schema<IContentForAdds>(
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

export const ContentForAdds = mongoose.model<IContentForAdds>(
  "ContentForAdds",
  ContentForAddsSchema
);
