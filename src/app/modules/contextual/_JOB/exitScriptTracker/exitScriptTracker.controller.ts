/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../common/utils/catchAsync";
import sendResponse from "../../../../common/utils/sendResponse";
import { exitScriptTracker_service } from "./exitScriptTracker.service";

const createExitScriptTracker = catchAsync(
  async (req: Request, res: Response) => {
    const result = await exitScriptTracker_service.createExitScriptTracker(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "ExitScriptTracker created successfully",
      data: result,
    });
  }
);

const getAllExitScriptTracker = catchAsync(
  async (req: Request, res: Response) => {
    const result = await exitScriptTracker_service.getAllExitScriptTracker(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "ExitScriptTrackers retrieved successfully",
      data: result,
    });
  }
);

const getExitScriptTrackerById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await exitScriptTracker_service.getExitScriptTrackerById(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "ExitScriptTracker not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "ExitScriptTracker retrieved successfully",
      data: result,
    });
  }
);

const updateExitScriptTracker = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await exitScriptTracker_service.updateExitScriptTracker(
      id,
      updateData
    );
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "ExitScriptTracker not found to update",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "ExitScriptTracker updated successfully",
      data: result,
    });
  }
);

const softDeleteExitScriptTracker = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await exitScriptTracker_service.softDeleteExitScriptTracker(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "ExitScriptTracker not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "ExitScriptTracker deleted successfully",
      data: result,
    });
  }
);

export const exitScriptTracker_controller = {
  createExitScriptTracker,
  getAllExitScriptTracker,
  getExitScriptTrackerById,
  updateExitScriptTracker,
  softDeleteExitScriptTracker,
};
