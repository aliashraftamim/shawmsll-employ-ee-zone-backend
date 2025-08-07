export interface IAvailableTime {
  date: string;
  startTime: string;
  endTime: string;
}

export interface IHrAdmin {
  expertise: string[];
  documents: string;

  availableTime: IAvailableTime[];

  description: string;

  isDeleted?: boolean;
}
