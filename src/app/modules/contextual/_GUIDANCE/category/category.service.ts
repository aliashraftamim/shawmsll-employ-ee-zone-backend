import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import AppError from "../../../../core/error/AppError";
import { ArrayFieldUpdater } from "../../../../toolkit/helpers/ArrayFieldUpdater";
import { User } from "../../../base/user/user.model";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";

const createCategory = async (
  adminId: mongoose.Types.ObjectId,
  payload: ICategory
) => {
  // validate admin
  await User.isUserExistById(adminId);

  return await Category.create(payload);
};

const updateCategory = async (categoryId: string, payload: ICategory) => {
  const isCategoryExist = await Category.findById(categoryId);

  if (!isCategoryExist) {
    throw new AppError(httpStatus.FORBIDDEN, "Category not found!");
  }

  if (isCategoryExist.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "Category was deleted!");
  }

  const result = await Category.findByIdAndUpdate(categoryId, payload, {
    new: true,
  });

  return result;
};

const getSingleCategory = async (categoryId: string) => {
  return await Category.findById(categoryId);
};

export const updateScenarioInCategory = async (
  categoryId: string,
  oldScenario: string,
  newScenario: string
) => {
  // category existence check
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }

  if (category.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "Category was deleted!");
  }

  // now delegate array update to the utility class
  const updater = new ArrayFieldUpdater(Category, categoryId, "scenario");

  const result = await updater.replace({ from: oldScenario, to: newScenario });

  return result;
};

const deleteCategory = async (categoryId: string) => {
  const isCategoryExist = await Category.findById(categoryId);

  if (!isCategoryExist) {
    throw new AppError(httpStatus.FORBIDDEN, "Category not found!");
  }
  if (isCategoryExist.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "Category was already deleted!");
  }

  const result = await Category.findByIdAndUpdate(
    categoryId,
    { isDeleted: true },
    {
      new: true,
    }
  );

  return result;
};

const getCategory = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const categoryService = {
  createCategory,
  updateCategory,
  getSingleCategory,
  getCategory,
  updateScenarioInCategory,
  deleteCategory,
};
