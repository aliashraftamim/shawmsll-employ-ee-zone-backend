import mongoose from "mongoose";

export interface IGuidanceHist {
  category: mongoose.Types.ObjectId;
  guidance: string;
  tips: string[];
  isDeleted: boolean;
}
