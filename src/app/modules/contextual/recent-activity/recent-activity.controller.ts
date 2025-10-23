/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../toolkit/utils/catchAsync";
import sendResponse from "../../../toolkit/utils/sendResponse";
import { recentActivity_service } from "./recent-activity.service";

const createRecentActivity = catchAsync(async (req: Request, res: Response) => {
  const result = await recentActivity_service.createRecentActivity(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "RecentActivity created successfully",
    data: result,
  });
});

const getAllRecentActivity = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  query.user = query.user || req.user.id;

  const result = await recentActivity_service.getAllRecentActivity(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "RecentActivitys retrieved successfully",
    data: result,
  });
});

const getRecentActivityById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await recentActivity_service.getRecentActivityById(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "RecentActivity not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "RecentActivity retrieved successfully",
      data: result,
    });
  }
);

const updateRecentActivity = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await recentActivity_service.updateRecentActivity(
    id,
    updateData
  );
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "RecentActivity not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "RecentActivity updated successfully",
    data: result,
  });
});

const softDeleteRecentActivity = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await recentActivity_service.softDeleteRecentActivity(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "RecentActivity not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "RecentActivity deleted successfully",
      data: result,
    });
  }
);

export const recentActivity_controller = {
  createRecentActivity,
  getAllRecentActivity,
  getRecentActivityById,
  updateRecentActivity,
  softDeleteRecentActivity,
};
