import { ObjectId } from "mongoose";

export interface ICategory {
  name: string;
  image: string;
  scenario: string[];
  admin: ObjectId;
  description?: string;
  isDeleted?: boolean;
}
