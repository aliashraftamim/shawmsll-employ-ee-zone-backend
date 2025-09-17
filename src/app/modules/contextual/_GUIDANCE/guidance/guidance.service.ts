/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../../../core/error/AppError";
import { recentActivity_service } from "../../recent-activity/recent-activity.service";
import { ICategory } from "../category/category.interface";
import { Category } from "../category/category.model";
import { IGuidance } from "./guidance.interface";
import { Guidance } from "./guidance.model";

const createGuidance = async (user: string, payload: IGuidance) => {
  const isGCatExist: ICategory | null = await Category.findById(
    payload.category
  );
  if (!isGCatExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Category is not found!!");
  }

  if (!isGCatExist.scenario.includes(payload.scenario)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Scenario is not exist in this category!"
    );
  }

  payload.categoryName = isGCatExist.name;

  const result = await Guidance.create(payload);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create guidance!");
  }

  await recentActivity_service.createRecentActivity({
    text: "Create a new Guidance",
    user: new mongoose.Types.ObjectId(user),
  });

  return result;
};

const getAllGuidance = async (query: Record<string, any>) => {
  const filter: Record<string, any> = { isDeleted: false };

  if (query?.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(query.date);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = { $gte: start, $lte: end };
  }

  return await Guidance.find(filter).populate("category");
};

const getSingleGuidance = async (id: string) => {
  const guidance = await Guidance.findOne({
    _id: id,
    isDeleted: false,
  }).populate("category");
  if (!guidance) {
    throw new AppError(httpStatus.NOT_FOUND, "Guidance not found!!");
  }
  return guidance;
};

const updateGuidance = async (id: string, payload: Partial<IGuidance>) => {
  const isExist = await Guidance.findOne({ _id: id, isDeleted: false });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Guidance not found!!");
  }

  if (payload.category) {
    const isCatExist = await Category.findById(payload.category);
    if (!isCatExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Category is not found!!");
    }
  }

  const updated = await Guidance.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

const deleteGuidance = async (id: string) => {
  const guidance = await Guidance.findOne({ _id: id, isDeleted: false });
  if (!guidance) {
    throw new AppError(httpStatus.NOT_FOUND, "Guidance not found!!");
  }

  guidance.isDeleted = true;
  await guidance.save();
  return { message: "Guidance deleted successfully!" };
};

export const guidance_service = {
  createGuidance,
  getAllGuidance,
  getSingleGuidance,
  updateGuidance,
  deleteGuidance,
};
