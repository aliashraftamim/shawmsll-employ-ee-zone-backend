// models/JobSearchTracker.model.ts
import mongoose, { Schema, model } from "mongoose";

const jobSearchTrackerSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    date: { type: String, required: true }, // you can use Date type if it's ISO format
    status: {
      type: String,
      enum: ["applied", "rejected", "interviewed"],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Optional: adds createdAt & updatedAt fields
  }
);

export const JobSearchTracker =
  mongoose.models.JobSearchTracker ||
  model("JobSearchTracker", jobSearchTrackerSchema);
