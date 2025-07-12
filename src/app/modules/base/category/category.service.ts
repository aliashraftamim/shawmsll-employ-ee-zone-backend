import httpStatus from "http-status";
import { ObjectId } from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import AppError from "../../../core/error/AppError";
import { User } from "../user/user.model";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";

const createCategory = async (adminId: ObjectId, payload: ICategory) => {
  // validate admin
  await User.isUserExistById(adminId);

  const result = await Category.create(payload);

  return result;
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
  getCategory,
  deleteCategory,
};
