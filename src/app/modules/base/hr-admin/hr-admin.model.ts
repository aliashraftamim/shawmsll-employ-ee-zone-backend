import { model, Schema } from "mongoose";
import { IAvailableTime, IHrAdmin } from "./hr-admin.interface";

const availableTimeSchema = new Schema<IAvailableTime>({
  startDay: { type: String, required: true },
  endDay: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const hrAdminSchema = new Schema<IHrAdmin>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    qualification: { type: String, required: true },
    expertise: [{ type: String, required: true }],
    documents: { type: String, required: true },
    availableTime: [availableTimeSchema],
    description: { type: String, default: "" },
    howHelp: [{ type: [String], required: true }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const HrAdmin = model<IHrAdmin>("HrAdmin", hrAdminSchema);
