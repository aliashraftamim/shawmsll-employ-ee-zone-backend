import mongoose from "mongoose";

export interface ICategory {
  name: string;
  image?: string;
  scenario: string[];

  admin: mongoose.Types.ObjectId;
  description?: string;
  isDeleted?: boolean;
}
