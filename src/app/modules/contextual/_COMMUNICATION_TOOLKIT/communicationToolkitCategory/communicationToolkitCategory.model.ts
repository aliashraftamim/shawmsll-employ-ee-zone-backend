import { Schema, model } from "mongoose";
import { ICommunicationToolkitCategory } from "./communicationToolkitCategory.interface";

const communicationToolkitCategorySchema =
  new Schema<ICommunicationToolkitCategory>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      image: {
        type: String,
        required: false,
        default: "",
      },
      tone: {
        type: [String],
        required: true,
      },
      message: {
        type: String,
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

export const CommunicationToolkitCategory =
  model<ICommunicationToolkitCategory>(
    "CommunicationToolkitCategory",
    communicationToolkitCategorySchema
  );
