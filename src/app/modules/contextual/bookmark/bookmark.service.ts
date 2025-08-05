/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { IBookmark } from "./bookmark.interface";
import { Bookmark } from "./bookmark.model";

const createBookmark = async (payload: IBookmark) => {
  return await Bookmark.create(payload);
};

const getAllBookmark = async (query: Record<string, any>) => {
  const bookmarkQuery = new QueryBuilder(
    Bookmark.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await bookmarkQuery.countTotal();
  const data = await bookmarkQuery.modelQuery;

  return { meta, data };
};

const getBookmarkById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await Bookmark.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateBookmark = async (id: string, updateData: Partial<IBookmark>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await Bookmark.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteBookmark = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await Bookmark.findByIdAndDelete(id);
};

export const bookmark_service = {
  createBookmark,
  getAllBookmark,
  getBookmarkById,
  updateBookmark,
  softDeleteBookmark,
};
