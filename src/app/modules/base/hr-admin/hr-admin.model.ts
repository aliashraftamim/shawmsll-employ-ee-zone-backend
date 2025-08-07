import { model, Schema } from "mongoose";
import { IAvailableTime, IHrAdmin } from "./hr-admin.interface";

const availableTimeSchema = new Schema<IAvailableTime>({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const hrAdminSchema = new Schema<IHrAdmin>({
  expertise: [{ type: String, required: true }],
  documents: [{ type: String, required: true }],
  availableTime: [availableTimeSchema],
  description: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

export const HrAdminModel = model<IHrAdmin>("HrAdmin", hrAdminSchema);
