import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { IWorkPlaceJournal } from "./workPlaceJournal.interface";
import { WorkPlaceJournal } from "./workPlaceJournal.model";

// ✅ Create
const createWorksJournal = async (payload: IWorkPlaceJournal) => {
  return await WorkPlaceJournal.create(payload);
};

// ✅ Get (with filter, pagination, etc.)
const getWorkplaceJournal = async (query: Record<string, unknown>) => {
  const workplaceQuery = new QueryBuilder(
    WorkPlaceJournal.find({ isDeleted: false }),
    query
  )
    .search([]) // add searchable fields here if needed
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await workplaceQuery.countTotal();
  const data = await workplaceQuery.modelQuery;

  return {
    meta,
    data,
  };
};

// ✅ Update
const updateWorkplaceJournal = async (
  id: mongoose.Types.ObjectId,
  payload: Partial<IWorkPlaceJournal>
) => {
  return await WorkPlaceJournal.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true }
  );
};

// ✅ Soft Delete
const deleteWorkplaceJournal = async (id: mongoose.Types.ObjectId) => {
  return await WorkPlaceJournal.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
};

export const workPlaceJournal_service = {
  createWorksJournal,
  getWorkplaceJournal,
  updateWorkplaceJournal,
  deleteWorkplaceJournal,
};
