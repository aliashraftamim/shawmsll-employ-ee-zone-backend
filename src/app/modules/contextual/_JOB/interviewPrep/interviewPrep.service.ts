/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { IInterviewPrep } from "./interviewPrep.interface";
import { InterviewPrep } from "./interviewPrep.model";

const createInterviewPrep = async (payload: IInterviewPrep) => {
  return await InterviewPrep.create(payload);
};

const getAllInterviewPrep = async (query: Record<string, any>) => {
  const interviewPrepQuery = new QueryBuilder(
    InterviewPrep.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await interviewPrepQuery.countTotal();
  const data = await interviewPrepQuery.modelQuery;

  return { meta, data };
};

const getInterviewPrepById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await InterviewPrep.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateInterviewPrep = async (
  id: string,
  updateData: Partial<IInterviewPrep>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await InterviewPrep.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteInterviewPrep = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await InterviewPrep.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const interviewPrep_service = {
  createInterviewPrep,
  getAllInterviewPrep,
  getInterviewPrepById,
  updateInterviewPrep,
  softDeleteInterviewPrep,
};
