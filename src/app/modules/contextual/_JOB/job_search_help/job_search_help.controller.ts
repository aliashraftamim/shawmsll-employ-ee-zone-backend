/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../toolkit/utils/catchAsync";
import sendResponse from "../../../../toolkit/utils/sendResponse";
import { jobSearchHelpService } from "./job_search_help.service";

const createJobSearchHelp = catchAsync(async (req: Request, res: Response) => {
  const result = await jobSearchHelpService.create(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "JobSearchHelp created successfully",
    data: result,
  });
});

const getAllJobSearchHelp = catchAsync(async (req: Request, res: Response) => {
  const result = await jobSearchHelpService.getAll(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "JobSearchHelps retrieved successfully",
    data: result,
  });
});

const getJobSearchHelpById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await jobSearchHelpService.getSingle(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "JobSearchHelp not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "JobSearchHelp retrieved successfully",
    data: result,
  });
});

const updateJobSearchHelp = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await jobSearchHelpService.update(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "JobSearchHelp not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "JobSearchHelp updated successfully",
    data: result,
  });
});

const softDeleteJobSearchHelp = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await jobSearchHelpService.softDelete(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "JobSearchHelp not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "JobSearchHelp deleted successfully",
      data: result,
    });
  }
);

export const jobSearchHelp_controller = {
  createJobSearchHelp,
  getAllJobSearchHelp,
  getJobSearchHelpById,
  updateJobSearchHelp,
  softDeleteJobSearchHelp,
};
