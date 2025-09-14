/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { IContentForAdds } from "./contentForAdds.interface";
import { ContentForAdds } from "./contentForAdds.model";

const createContentForAdds = async (payload: IContentForAdds) => {
  return await ContentForAdds.create(payload);
};

const getAllContentForAdds = async (query: Record<string, any>) => {
  const contentForAddsQuery = new QueryBuilder(
    ContentForAdds.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await contentForAddsQuery.countTotal();
  const data = await contentForAddsQuery.modelQuery;

  return { meta, data };
};

const getContentForAddsById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ContentForAdds.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateContentForAdds = async (
  id: string,
  updateData: Partial<IContentForAdds>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ContentForAdds.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteContentForAdds = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ContentForAdds.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const contentForAdds_service = {
  createContentForAdds,
  getAllContentForAdds,
  getContentForAddsById,
  updateContentForAdds,
  softDeleteContentForAdds,
};
