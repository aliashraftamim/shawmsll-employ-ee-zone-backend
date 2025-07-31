/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import { guidanceOnLeavingBenefits_service } from "./GuidanceOnLeavingBenefits.service";
import catchAsync from "../../../../common/utils/catchAsync";
import sendResponse from "../../../../common/utils/sendResponse";

const createGuidanceOnLeavingBenefits = catchAsync(async (req: Request, res: Response) => {
  const result = await guidanceOnLeavingBenefits_service.createGuidanceOnLeavingBenefits(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "GuidanceOnLeavingBenefits created successfully",
    data: result,
  });
});

const getAllGuidanceOnLeavingBenefits = catchAsync(async (req: Request, res: Response) => {
  const result = await guidanceOnLeavingBenefits_service.getAllGuidanceOnLeavingBenefits(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "GuidanceOnLeavingBenefitss retrieved successfully",
    data: result,
  });
});

const getGuidanceOnLeavingBenefitsById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await guidanceOnLeavingBenefits_service.getGuidanceOnLeavingBenefitsById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "GuidanceOnLeavingBenefits not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "GuidanceOnLeavingBenefits retrieved successfully",
    data: result,
  });
});

const updateGuidanceOnLeavingBenefits = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await guidanceOnLeavingBenefits_service.updateGuidanceOnLeavingBenefits(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "GuidanceOnLeavingBenefits not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "GuidanceOnLeavingBenefits updated successfully",
    data: result,
  });
});

const softDeleteGuidanceOnLeavingBenefits = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await guidanceOnLeavingBenefits_service.softDeleteGuidanceOnLeavingBenefits(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "GuidanceOnLeavingBenefits not found to delete",
      data: undefined,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "GuidanceOnLeavingBenefits deleted successfully",
    data: result,
  });
});

export const guidanceOnLeavingBenefits_controller = {
  createGuidanceOnLeavingBenefits,
  getAllGuidanceOnLeavingBenefits,
  getGuidanceOnLeavingBenefitsById,
  updateGuidanceOnLeavingBenefits,
  softDeleteGuidanceOnLeavingBenefits,
};
