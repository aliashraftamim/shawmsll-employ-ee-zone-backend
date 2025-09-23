import mongoose from "mongoose";

export interface IGuidanceSuggestion {
  suggestion: string;
  tips: string[];
  suggestedScript: string;

  category: mongoose.Types.ObjectId | string;
  scenario: string;

  isDeleted?: boolean;
}
