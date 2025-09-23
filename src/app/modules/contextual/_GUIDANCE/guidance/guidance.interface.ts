import { ObjectId } from "mongoose";

export interface IGuidance {
  categoryName: string;
  category: ObjectId;
  scenario: string;
  guidance: string;
  tips: string[];
  suggestedScript: string;
  isDeleted: boolean;
}
