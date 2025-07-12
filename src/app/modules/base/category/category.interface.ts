import { ObjectId } from "mongoose";

export interface ICategory {
  name: string;
  image: string;
  admin: ObjectId;
  description?: string;
  isDeleted?: boolean;
}
