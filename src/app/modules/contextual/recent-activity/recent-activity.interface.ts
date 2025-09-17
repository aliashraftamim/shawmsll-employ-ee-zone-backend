import mongoose from "mongoose";

export interface IRecentActivity {
  user: mongoose.Types.ObjectId;
  text: string;
}
