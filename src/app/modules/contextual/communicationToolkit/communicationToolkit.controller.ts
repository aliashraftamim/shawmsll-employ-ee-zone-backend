/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { communicationToolkit_service } from "./communicationToolkit.service";

// Create
const createToolkit = catchAsync(async (req: Request, res: Response) => {
  const result = await communicationToolkit_service.createToolkit(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Communication Toolkit created successfully!",
    data: result,
  });
});

// Get All
const getAllToolkit = catchAsync(async (req: Request, res: Response) => {
  const result = await communicationToolkit_service.getAllToolkit(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Communication Toolkit fetched successfully!",
    data: result,
  });
});

// Update
const updateToolkit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const objectId = new mongoose.Types.ObjectId(id);

  const result = await communicationToolkit_service.updateToolkit(
    objectId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Toolkit updated successfully!",
    data: result,
  });
});

// Delete
const deleteToolkit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const objectId = new mongoose.Types.ObjectId(id);

  const result = await communicationToolkit_service.deleteToolkit(objectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Toolkit deleted successfully!",
    data: result,
  });
});

export const communicationToolkit_controller = {
  createToolkit,
  getAllToolkit,
  updateToolkit,
  deleteToolkit,
};
