/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { IPolicyRights } from "./policy&rights.interface";
import { PolicyRightsModel } from "./policy&rights.model";

const createPolicyRights = async (payload: IPolicyRights) => {
  return await PolicyRightsModel.create(payload);
};

const getAllPolicyRights = async (Query: Record<string, any>) => {
  const policyRightsQuery = new QueryBuilder(
    PolicyRightsModel.find({ isDeleted: { $ne: true } }),
    Query
  )
    .search(["title"])
    .sort()
    .paginate()
    .fields();

  const meta = await policyRightsQuery.countTotal();
  const data = await policyRightsQuery.modelQuery;

  return { meta, data };
};

const getPolicyRightsById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await PolicyRightsModel.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
};

const updatePolicyRights = async (
  id: string,
  updateData: Partial<IPolicyRights>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await PolicyRightsModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const softDeletePolicyRights = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await PolicyRightsModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const PolicyRightsService = {
  createPolicyRights,
  getAllPolicyRights,
  getPolicyRightsById,
  updatePolicyRights,
  softDeletePolicyRights,
};
