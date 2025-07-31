/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../common/utils/catchAsync";
import sendResponse from "../../../../common/utils/sendResponse";
import { resumeTips_service } from "./resumeTips.service";

const createResumeTips = catchAsync(async (req: Request, res: Response) => {
  const result = await resumeTips_service.createResumeTips(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "ResumeTips created successfully",
    data: result,
  });
});

const getAllResumeTips = catchAsync(async (req: Request, res: Response) => {
  const result = await resumeTips_service.getAllResumeTips(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ResumeTipss retrieved successfully",
    data: result,
  });
});

const getResumeTipsById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await resumeTips_service.getResumeTipsById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "ResumeTips not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ResumeTips retrieved successfully",
    data: result,
  });
});

const updateResumeTips = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await resumeTips_service.updateResumeTips(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "ResumeTips not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ResumeTips updated successfully",
    data: result,
  });
});

const softDeleteResumeTips = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await resumeTips_service.softDeleteResumeTips(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "ResumeTips not found to delete",
      data: undefined,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ResumeTips deleted successfully",
    data: result,
  });
});

export const resumeTips_controller = {
  createResumeTips,
  getAllResumeTips,
  getResumeTipsById,
  updateResumeTips,
  softDeleteResumeTips,
};
