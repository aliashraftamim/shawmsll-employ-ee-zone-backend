import mongoose, { Schema } from "mongoose";
import { IBookmark } from "./bookmark.interface";

const BookmarkSchema = new Schema<IBookmark>(
  {
    type: { type: String, required: true },
    itemTitle: { type: String, required: true },
    itemId: { type: String, required: true },
    content: { type: String },
    category: { type: String },
    tags: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Bookmark = mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
