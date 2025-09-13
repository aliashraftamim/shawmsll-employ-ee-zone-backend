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
  const filter: Record<string, unknown> = { isDeleted: false };
  const modifiedQuery = { ...query };

  // Date filter handle
  if (query?.date) {
    const start = new Date(query.date as string);
    start.setHours(0, 0, 0, 0);

    const end = new Date(query.date as string);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = { $gte: start, $lte: end };
    delete modifiedQuery.date; // raw date field DB filter এ না যাক
  }

  const workplaceQuery = new QueryBuilder(
    WorkPlaceJournal.find(filter),
    modifiedQuery
  )
    .search([]) // 👉 চাইলে এখানে ["title", "description"] দাও
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await workplaceQuery.countTotal();
  const data = await workplaceQuery.modelQuery;

  return { meta, data };
};

// ✅ Get Single
const getSingleWorkplaceJournal = async (id: mongoose.Types.ObjectId) => {
  return await WorkPlaceJournal.findOne({ _id: id, isDeleted: false });
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
  getSingleWorkplaceJournal,
  updateWorkplaceJournal,
  deleteWorkplaceJournal,
};
