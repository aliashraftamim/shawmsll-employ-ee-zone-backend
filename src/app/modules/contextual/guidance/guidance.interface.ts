import { ObjectId } from "mongoose";

export interface IGuidance {
  title: string;
  category: ObjectId;
  isDeleted: boolean;
}
