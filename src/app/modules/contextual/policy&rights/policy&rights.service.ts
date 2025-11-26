/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { IPolicyRights, PR_CATEGORY } from "./policy&rights.interface";
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
    .filter()
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

  const existingPolicyRights = await PolicyRightsModel.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });

  if (!existingPolicyRights) {
    throw new Error("PolicyRights not found");
  }

  // Category change হচ্ছে কিনা check করুন
  if (
    updateData.category &&
    updateData.category !== existingPolicyRights.category
  ) {
    // federal-law থেকে state এ change
    if (
      existingPolicyRights.category === PR_CATEGORY.FEDERAL_LAW &&
      updateData.category === PR_CATEGORY.STATE
    ) {
      if (!updateData.state) {
        throw new Error(
          "State information is required when changing to state category"
        );
      }
      // federalLaw field remove করুন
      updateData.federalLaw = {
        policyLaw: "",
        content: "",
      };
    }

    // state থেকে federal-law এ change
    if (
      existingPolicyRights.category === PR_CATEGORY.STATE &&
      updateData.category === PR_CATEGORY.FEDERAL_LAW
    ) {
      if (!updateData.federalLaw) {
        throw new Error(
          "Federal law information is required when changing to federal-law category"
        );
      }
      // state field remove করুন
      updateData.state = {
        stateName: "",
        stateTitle: "",
      };
    }
  }

  // Same category তে থাকলে wrong field update করতে দেবেন না
  if (
    !updateData.category ||
    updateData.category === existingPolicyRights.category
  ) {
    if (
      existingPolicyRights.category === PR_CATEGORY.FEDERAL_LAW &&
      updateData.state
    ) {
      throw new Error("Cannot add state information to federal-law category");
    }

    if (
      existingPolicyRights.category === PR_CATEGORY.STATE &&
      updateData.federalLaw
    ) {
      throw new Error("Cannot add federal law information to state category");
    }
  }

  return await PolicyRightsModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true, // Mongoose validation চালু রাখুন
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
