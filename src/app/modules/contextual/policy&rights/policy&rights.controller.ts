/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { PolicyRightsService } from "./policy&rights.service";

const createPolicyRights = catchAsync(async (req: Request, res: Response) => {
  const result = await PolicyRightsService.createPolicyRights(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "PolicyRights created successfully",
    data: result,
  });
});

const getAllPolicyRights = catchAsync(async (req: Request, res: Response) => {
  const result = await PolicyRightsService.getAllPolicyRights();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "PolicyRights retrieved successfully",
    data: result,
  });
});

const getPolicyRightsById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PolicyRightsService.getPolicyRightsById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "PolicyRights not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "PolicyRights retrieved successfully",
    data: result,
  });
});

const updatePolicyRights = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await PolicyRightsService.updatePolicyRights(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "PolicyRights not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "PolicyRights updated successfully",
    data: result,
  });
});

const softDeletePolicyRights = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PolicyRightsService.softDeletePolicyRights(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "PolicyRights not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "PolicyRights deleted successfully",
      data: result,
    });
  }
);

export const PolicyRights_controller = {
  createPolicyRights,
  getAllPolicyRights,
  getPolicyRightsById,
  updatePolicyRights,
  softDeletePolicyRights,
};
