import mongoose from "mongoose";

export interface ISupport {
  user: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  isDeleted: boolean;
}
