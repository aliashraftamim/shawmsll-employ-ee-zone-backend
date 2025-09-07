import mongoose from "mongoose";

export interface IAvailableTime {
  startDay: string;
  endDay: string;
  startTime: string;
  endTime: string;
}

export interface IHrAdmin {
  user: mongoose.Types.ObjectId;
  qualification: string;
  expertise: string[];
  documents: string;
  availableTime: IAvailableTime;
  description: string;
  howHelp: string[];
  isDeleted?: boolean;
}
