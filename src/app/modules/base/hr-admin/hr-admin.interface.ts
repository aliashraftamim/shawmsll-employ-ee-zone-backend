import mongoose from "mongoose";

export interface IAvailableTime {
  date: string;
  startTime: string;
  endTime: string;
}

export interface IHrAdmin {
  user: mongoose.Types.ObjectId;

  expertise: string[];
  documents: string;
  availableTime: IAvailableTime[];
  description: string;

  isDeleted?: boolean;
}
