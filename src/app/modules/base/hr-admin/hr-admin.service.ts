/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { IHrAdmin } from "./hr-admin.interface";
import { HrAdmin } from "./hr-admin.model";

const createHrAdmin = async (payload: IHrAdmin) => {
  return await HrAdmin.create(payload);
};

const getAllHrAdmin = async (query: Record<string, any>) => {
  const hrAdminQuery = new QueryBuilder(
    HrAdmin.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await hrAdminQuery.countTotal();
  const data = await hrAdminQuery.modelQuery;

  return { meta, data };
};

const getHrAdminById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await HrAdmin.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateHrAdmin = async (id: string, updateData: Partial<IHrAdmin>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await HrAdmin.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteHrAdmin = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await HrAdmin.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const hrAdmin_service = {
  createHrAdmin,
  getAllHrAdmin,
  getHrAdminById,
  updateHrAdmin,
  softDeleteHrAdmin,
};
