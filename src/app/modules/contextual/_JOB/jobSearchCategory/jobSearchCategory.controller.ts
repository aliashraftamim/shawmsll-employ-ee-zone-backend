/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../common/utils/catchAsync";
import sendResponse from "../../../../common/utils/sendResponse";
import { jobSearchCategoryService } from "./jobSearchCategory.service";

const createJobSearchCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await jobSearchCategoryService.createJobSearchCategory(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "JobSearchCategory created successfully",
      data: result,
    });
  }
);

const getAllJobSearchCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await jobSearchCategoryService.getAllJobSearchCategory(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "JobSearchCategorys retrieved successfully",
      data: result,
    });
  }
);

const getJobSearchCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await jobSearchCategoryService.getJobSearchCategoryById(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "JobSearchCategory not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "JobSearchCategory retrieved successfully",
      data: result,
    });
  }
);

const updateJobSearchCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await jobSearchCategoryService.updateJobSearchCategory(
      id,
      updateData
    );
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "JobSearchCategory not found to update",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "JobSearchCategory updated successfully",
      data: result,
    });
  }
);

const softDeleteJobSearchCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await jobSearchCategoryService.softDeleteJobSearchCategory(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "JobSearchCategory not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "JobSearchCategory deleted successfully",
      data: result,
    });
  }
);

export const jobSearchCategory_controller = {
  createJobSearchCategory,
  getAllJobSearchCategory,
  getJobSearchCategoryById,
  updateJobSearchCategory,
  softDeleteJobSearchCategory,
};
