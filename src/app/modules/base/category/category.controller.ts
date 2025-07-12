import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { categoryService } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const result = await categoryService.createCategory(req?.user?.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category created successfully",
    data: result,
  });
});
const updateCategory = catchAsync(async (req, res) => {
  const result = await categoryService.updateCategory(
    req?.params.categoryId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "category updated successfully",
    data: result,
  });
});
const deleteCategory = catchAsync(async (req, res) => {
  const result = await categoryService.deleteCategory(req?.params?.categoryId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: result,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const result = await categoryService.getCategory(req?.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retrieved category successfully",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
};
