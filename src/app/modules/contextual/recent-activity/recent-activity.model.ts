import mongoose, { Schema } from "mongoose";
import { IRecentActivity } from "./recent-activity.interface";

const RecentActivitySchema = new Schema<IRecentActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const RecentActivity = mongoose.model<IRecentActivity>(
  "RecentActivity",
  RecentActivitySchema
);
