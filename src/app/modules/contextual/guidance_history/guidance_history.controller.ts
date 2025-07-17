/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { GuidHist_service } from "./guidance_history.service";

// Create new guidance history
const createGuidHist = catchAsync(async (req: Request, res: Response) => {
  const result = await GuidHist_service.createGuiHist(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Guidance history created successfully",
    data: result,
  });
});

// Get all guidance histories
const getAllGuidHist = catchAsync(async (req: Request, res: Response) => {
  const result = await GuidHist_service.getAllGuiHist();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guidance histories retrieved successfully",
    data: result,
  });
});

// Get single guidance history by id
const getGuidHistById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GuidHist_service.getGuiHistById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Guidance history not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guidance history retrieved successfully",
    data: result,
  });
});

// Update guidance history by id
const updateGuidHist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await GuidHist_service.updateGuiHist(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Guidance history not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guidance history updated successfully",
    data: result,
  });
});

// Soft delete guidance history by id
const softDeleteGuidHist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GuidHist_service.softDeleteGuiHist(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Guidance history not found to delete",
      data: undefined,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guidance history deleted successfully",
    data: result,
  });
});

export const guidance_history_controller = {
  createGuidHist,
  getAllGuidHist,
  getGuidHistById,
  updateGuidHist,
  softDeleteGuidHist,
};
