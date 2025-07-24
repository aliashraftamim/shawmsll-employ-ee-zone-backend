/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { policyCategoryService } from "./policyCategory.service";

const createPolicyCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await policyCategoryService.createPolicyCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "PolicyCategory created successfully",
    data: result,
  });
});

const getAllPolicyCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await policyCategoryService.getAllPolicyCategory();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "PolicyCategorys retrieved successfully",
    data: result,
  });
});

const getPolicyCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await policyCategoryService.getPolicyCategoryById(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "PolicyCategory not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "PolicyCategory retrieved successfully",
      data: result,
    });
  }
);

const updatePolicyCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await policyCategoryService.updatePolicyCategory(
    id,
    updateData
  );
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "PolicyCategory not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "PolicyCategory updated successfully",
    data: result,
  });
});

const softDeletePolicyCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await policyCategoryService.softDeletePolicyCategory(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "PolicyCategory not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "PolicyCategory deleted successfully",
      data: result,
    });
  }
);

export const policyCategory_controller = {
  createPolicyCategory,
  getAllPolicyCategory,
  getPolicyCategoryById,
  updatePolicyCategory,
  softDeletePolicyCategory,
};
