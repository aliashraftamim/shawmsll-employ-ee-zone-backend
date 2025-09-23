import mongoose, { Schema } from "mongoose";
import { IGuidanceSuggestion } from "./guidance_suggestion.interface";

const GuidanceSuggestionSchema = new Schema<IGuidanceSuggestion>(
  {
    suggestion: { type: String, required: true },
    tips: { type: [String], required: true },
    suggestedScript: { type: String, required: true },

    category: { type: String, required: true },
    scenario: { type: String, required: true },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GuidanceSuggestion = mongoose.model<IGuidanceSuggestion>(
  "GuidanceSuggestion",
  GuidanceSuggestionSchema
);
