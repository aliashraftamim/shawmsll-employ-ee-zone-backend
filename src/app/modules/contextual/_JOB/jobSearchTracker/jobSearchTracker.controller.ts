/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../toolkit/utils/catchAsync";
import sendResponse from "../../../../toolkit/utils/sendResponse";
import { jobSearchTracker_service } from "./jobSearchTracker.service";

const createJobSearchTracker = catchAsync(
  async (req: Request, res: Response) => {
    const result = await jobSearchTracker_service.createJobSearchTracker(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "JobSearchTracker created successfully",
      data: result,
    });
  }
);

const getAllJobSearchTracker = catchAsync(
  async (req: Request, res: Response) => {
    const result = await jobSearchTracker_service.getAllJobSearchTracker(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "JobSearchTrackers retrieved successfully",
      data: result,
    });
  }
);

const getJobSearchTrackerById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await jobSearchTracker_service.getJobSearchTrackerById(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "JobSearchTracker not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "JobSearchTracker retrieved successfully",
      data: result,
    });
  }
);

const updateJobSearchTracker = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await jobSearchTracker_service.updateJobSearchTracker(
      id,
      updateData
    );
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "JobSearchTracker not found to update",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "JobSearchTracker updated successfully",
      data: result,
    });
  }
);

const softDeleteJobSearchTracker = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await jobSearchTracker_service.softDeleteJobSearchTracker(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "JobSearchTracker not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "JobSearchTracker deleted successfully",
      data: result,
    });
  }
);

export const jobSearchTracker_controller = {
  createJobSearchTracker,
  getAllJobSearchTracker,
  getJobSearchTrackerById,
  updateJobSearchTracker,
  softDeleteJobSearchTracker,
};
