/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../toolkit/utils/catchAsync";
import sendResponse from "../../../toolkit/utils/sendResponse";
import { scheduleType_service } from "./scheduleType.service";

const createScheduleType = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleType_service.createScheduleType(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "ScheduleType created successfully",
    data: result,
  });
});

const getAllScheduleType = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleType_service.getAllScheduleType(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ScheduleTypes retrieved successfully",
    data: result,
  });
});

const getScheduleTypeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await scheduleType_service.getScheduleTypeById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "ScheduleType not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ScheduleType retrieved successfully",
    data: result,
  });
});

const updateScheduleType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await scheduleType_service.updateScheduleType(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "ScheduleType not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ScheduleType updated successfully",
    data: result,
  });
});

const softDeleteScheduleType = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await scheduleType_service.softDeleteScheduleType(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "ScheduleType not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "ScheduleType deleted successfully",
      data: result,
    });
  }
);

export const scheduleType_controller = {
  createScheduleType,
  getAllScheduleType,
  getScheduleTypeById,
  updateScheduleType,
  softDeleteScheduleType,
};
