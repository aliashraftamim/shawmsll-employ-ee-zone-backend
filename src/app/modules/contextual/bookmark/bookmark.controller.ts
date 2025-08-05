/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { bookmark_service } from "./bookmark.service";

const createBookmark = catchAsync(async (req: Request, res: Response) => {
  const result = await bookmark_service.createBookmark(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Bookmark created successfully",
    data: result,
  });
});

const getAllBookmark = catchAsync(async (req: Request, res: Response) => {
  const result = await bookmark_service.getAllBookmark(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmarks retrieved successfully",
    data: result,
  });
});

const getBookmarkById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bookmark_service.getBookmarkById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Bookmark not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmark retrieved successfully",
    data: result,
  });
});

const updateBookmark = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await bookmark_service.updateBookmark(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Bookmark not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmark updated successfully",
    data: result,
  });
});

const softDeleteBookmark = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bookmark_service.softDeleteBookmark(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Bookmark not found to delete",
      data: undefined,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmark deleted successfully",
    data: result,
  });
});

export const bookmark_controller = {
  createBookmark,
  getAllBookmark,
  getBookmarkById,
  updateBookmark,
  softDeleteBookmark,
};
