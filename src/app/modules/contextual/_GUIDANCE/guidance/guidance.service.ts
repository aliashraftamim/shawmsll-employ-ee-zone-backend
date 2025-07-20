import httpStatus from "http-status";
import AppError from "../../../../core/error/AppError";
import { ICategory } from "../category/category.interface";
import { Category } from "../category/category.model";
import { IGuidance } from "./guidance.interface";
import { Guidance } from "./guidance.model";

const createGuidance = async (payload: IGuidance) => {
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

  return await Guidance.create(payload);
};

const getAllGuidance = async () => {
  return await Guidance.find({ isDeleted: false }).populate("category");
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
