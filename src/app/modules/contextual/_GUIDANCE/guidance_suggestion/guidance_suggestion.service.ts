/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { Category } from "../category/category.model";
import { IGuidanceSuggestion } from "./guidance_suggestion.interface";
import { GuidanceSuggestion } from "./guidance_suggestion.model";

const createGuidanceSuggestion = async (payload: IGuidanceSuggestion) => {
  const filter: Record<string, any> = { isDeleted: { $ne: true } };

  filter._id = new mongoose.Types.ObjectId(payload.category);

  filter.scenario = payload.scenario;

  const isCategory = await Category.findOne(filter);

  if (!isCategory) {
    throw new Error(
      "Category not found or does not match the provided scenarios"
    );
  }

  return await GuidanceSuggestion.create(payload);
};

const getAllGuidanceSuggestion = async (query: Record<string, any>) => {
  const guidanceSuggestionQuery = new QueryBuilder(
    GuidanceSuggestion.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await guidanceSuggestionQuery.countTotal();
  const data = await guidanceSuggestionQuery.modelQuery;

  return { meta, data };
};

const getGuidanceSuggestionById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await GuidanceSuggestion.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
};

const guidanceSuggestionByCategoryAndScenario = async (
  query: Record<string, any>
) => {
  const { category, scenario } = query;

  const filter: Record<string, any> = { isDeleted: { $ne: true } };

  filter.category = category;
  filter.scenario = scenario;

  const result = await GuidanceSuggestion.findOne(filter);

  return result;
};

const updateGuidanceSuggestion = async (
  id: string,
  updateData: Partial<IGuidanceSuggestion>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await GuidanceSuggestion.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

const softDeleteGuidanceSuggestion = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await GuidanceSuggestion.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const guidanceSuggestion_service = {
  createGuidanceSuggestion,
  getAllGuidanceSuggestion,
  getGuidanceSuggestionById,
  updateGuidanceSuggestion,
  softDeleteGuidanceSuggestion,
  guidanceSuggestionByCategoryAndScenario,
};
