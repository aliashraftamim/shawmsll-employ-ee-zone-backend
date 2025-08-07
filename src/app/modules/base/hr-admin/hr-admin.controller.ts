/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { hrAdmin_service } from "./hr-admin.service";

const createHrAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await hrAdmin_service.createHrAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "HrAdmin created successfully",
    data: result,
  });
});

const getAllHrAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await hrAdmin_service.getAllHrAdmin(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "HrAdmins retrieved successfully",
    data: result,
  });
});

const getHrAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await hrAdmin_service.getHrAdminById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "HrAdmin not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "HrAdmin retrieved successfully",
    data: result,
  });
});

const updateHrAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await hrAdmin_service.updateHrAdmin(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "HrAdmin not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "HrAdmin updated successfully",
    data: result,
  });
});

const softDeleteHrAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await hrAdmin_service.softDeleteHrAdmin(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "HrAdmin not found to delete",
      data: undefined,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "HrAdmin deleted successfully",
    data: result,
  });
});

export const hrAdmin_controller = {
  createHrAdmin,
  getAllHrAdmin,
  getHrAdminById,
  updateHrAdmin,
  softDeleteHrAdmin,
};
