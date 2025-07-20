import { model, Schema } from "mongoose";
import { IWorkPlaceJournal } from "./workPlaceJournal.interface";

const workPlaceJournalSchema = new Schema<IWorkPlaceJournal>(
  {
    title: {
      type: String,
      default: "",
      trim: true,
      required: true,
    },
    note: {
      type: String,
      default: "",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkPlaceJournal = model<IWorkPlaceJournal>(
  "WorkPlaceJournal",
  workPlaceJournalSchema
);
