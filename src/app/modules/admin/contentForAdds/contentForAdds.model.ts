import mongoose, { Schema } from "mongoose";
import { IContentForAdds } from "./contentForAdds.interface";

const ContentForAddsSchema = new Schema<IContentForAdds>(
  {
    contentType: { type: String, required: true },
    image: { type: String, default: null },
    content: { type: String, required: true },
    date: { type: String, default: null },
    time: { type: String, default: null },
    isSent: { type: Boolean, default: true },
    targetUsers: {
      allUser: { type: Boolean, default: false },
      freePlanUser: { type: Boolean, default: false },
      premiumUser: { type: Boolean, default: false },
    },

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
