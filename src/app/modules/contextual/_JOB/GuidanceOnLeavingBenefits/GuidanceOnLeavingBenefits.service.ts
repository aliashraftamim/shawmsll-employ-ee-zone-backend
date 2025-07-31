/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { IGuidanceOnLeavingBenefits } from "./GuidanceOnLeavingBenefits.interface";
import { GuidanceOnLeavingBenefits } from "./GuidanceOnLeavingBenefits.model";

const createGuidanceOnLeavingBenefits = async (
  payload: IGuidanceOnLeavingBenefits
) => {
  return await GuidanceOnLeavingBenefits.create(payload);
};

const getAllGuidanceOnLeavingBenefits = async (query: Record<string, any>) => {
  const guidanceOnLeavingBenefitsQuery = new QueryBuilder(
    GuidanceOnLeavingBenefits.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await guidanceOnLeavingBenefitsQuery.countTotal();
  const data = await guidanceOnLeavingBenefitsQuery.modelQuery;

  return { meta, data };
};

const getGuidanceOnLeavingBenefitsById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await GuidanceOnLeavingBenefits.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
};

const updateGuidanceOnLeavingBenefits = async (
  id: string,
  updateData: Partial<IGuidanceOnLeavingBenefits>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await GuidanceOnLeavingBenefits.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const softDeleteGuidanceOnLeavingBenefits = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await GuidanceOnLeavingBenefits.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const guidanceOnLeavingBenefits_service = {
  createGuidanceOnLeavingBenefits,
  getAllGuidanceOnLeavingBenefits,
  getGuidanceOnLeavingBenefitsById,
  updateGuidanceOnLeavingBenefits,
  softDeleteGuidanceOnLeavingBenefits,
};
