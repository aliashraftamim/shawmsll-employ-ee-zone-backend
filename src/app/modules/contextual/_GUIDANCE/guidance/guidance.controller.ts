/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../../../toolkit/utils/catchAsync";
import sendResponse from "../../../../toolkit/utils/sendResponse";
import { guidance_service } from "./guidance.service";

const createGuidance = catchAsync(async (req, res) => {
  const result = await guidance_service.createGuidance(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guidance is created successfully!",
    data: result,
  });
});

const getAllGuidance = catchAsync(async (req, res) => {
  const result = await guidance_service.getAllGuidance(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guidance list fetched successfully!",
    data: result,
  });
});

const getSingleGuidance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await guidance_service.getSingleGuidance(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guidance fetched successfully!",
    data: result,
  });
});

const updateGuidance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await guidance_service.updateGuidance(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guidance updated successfully!",
    data: result,
  });
});

const deleteGuidance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await guidance_service.deleteGuidance(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

export const guidance_controller = {
  createGuidance,
  getAllGuidance,
  getSingleGuidance,
  updateGuidance,
  deleteGuidance,
};
