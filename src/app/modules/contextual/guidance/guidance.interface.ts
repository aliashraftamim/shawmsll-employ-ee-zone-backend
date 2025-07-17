import { ObjectId } from "mongoose";

export interface IGuidance {
  categoryName: string;
  category: ObjectId;
  scenario: string;
  content: string;
  isDeleted: boolean;
}
