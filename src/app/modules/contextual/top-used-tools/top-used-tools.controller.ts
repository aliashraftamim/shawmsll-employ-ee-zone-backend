/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../toolkit/utils/catchAsync";
import sendResponse from "../../../toolkit/utils/sendResponse";
import { topUsedTools_service } from "./top-used-tools.service";

const createTopUsedTools = catchAsync(async (req: Request, res: Response) => {
  const result = await topUsedTools_service.createTopUsedTools(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "TopUsedTools created successfully",
    data: result,
  });
});

const getAllTopUsedTools = catchAsync(async (req: Request, res: Response) => {
  const result = await topUsedTools_service.getAllTopUsedTools(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TopUsedTools retrieved successfully",
    data: result,
  });
});

const getTopUsedToolsById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await topUsedTools_service.getTopUsedToolsById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "TopUsedTools not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TopUsedTools retrieved successfully",
    data: result,
  });
});

const updateTopUsedTools = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await topUsedTools_service.updateTopUsedTools(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "TopUsedTools not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TopUsedTools updated successfully",
    data: result,
  });
});

const softDeleteTopUsedTools = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await topUsedTools_service.softDeleteTopUsedTools(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "TopUsedTools not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "TopUsedTools deleted successfully",
      data: result,
    });
  }
);

export const topUsedTools_controller = {
  createTopUsedTools,
  getAllTopUsedTools,
  getTopUsedToolsById,
  updateTopUsedTools,
  softDeleteTopUsedTools,
};
