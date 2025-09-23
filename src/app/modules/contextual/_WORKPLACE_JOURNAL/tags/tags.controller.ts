/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../toolkit/utils/catchAsync";
import sendResponse from "../../../../toolkit/utils/sendResponse";
import { tagsService } from "./tags.service";

const createTags = catchAsync(async (req: Request, res: Response) => {
  const result = await tagsService.createTags(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tags created successfully",
    data: result,
  });
});

const getAllTags = catchAsync(async (req: Request, res: Response) => {
  const result = await tagsService.getAllTags(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tags retrieved successfully",
    data: result,
  });
});

const getTagsById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await tagsService.getTagsById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Tags not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tags retrieved successfully",
    data: result,
  });
});

const updateTags = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await tagsService.updateTags(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Tags not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tags updated successfully",
    data: result,
  });
});

const softDeleteTags = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await tagsService.softDeleteTags(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Tags not found to delete",
      data: undefined,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tags deleted successfully",
    data: result,
  });
});

export const tags_controller = {
  createTags,
  getAllTags,
  getTagsById,
  updateTags,
  softDeleteTags,
};
