import { Schema, model } from "mongoose";

export interface INoteHist {
  title: string;
  body: string;
  tag: string[];
  isDeleted: boolean;
}

const noteHistSchema = new Schema<INoteHist>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tag: [{ type: String, required: true }],
  isDeleted: { type: Boolean, default: false },
});

export const NoteHist = model<INoteHist>("NoteHist", noteHistSchema);
