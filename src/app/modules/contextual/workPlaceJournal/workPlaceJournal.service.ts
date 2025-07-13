import { IWorkPlaceJournal } from "./workPlaceJournal.interface";
import { WorkPlaceJournal } from "./workPlaceJournal.model";

const createWorksJournal = async (payload: IWorkPlaceJournal) => {
  const result = await WorkPlaceJournal.create(payload);
  return result;
};

export const workPlaceJournal_service = {
  createWorksJournal,
};
