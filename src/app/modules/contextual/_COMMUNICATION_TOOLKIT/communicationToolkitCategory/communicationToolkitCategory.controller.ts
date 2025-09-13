/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../toolkit/utils/catchAsync";
import sendResponse from "../../../../toolkit/utils/sendResponse";
import { communicationToolkitCategoryService } from "./communicationToolkitCategory.service";

const createCommunicationToolkitCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await communicationToolkitCategoryService.createCommunicationToolkitCategory(
        req.body
      );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "CommunicationToolkitCategory created successfully",
      data: result,
    });
  }
);

const getAllCommunicationToolkitCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await communicationToolkitCategoryService.getAllCommunicationToolkitCategory();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CommunicationToolkitCategory retrieved successfully",
      data: result,
    });
  }
);

const getCommunicationToolkitCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await communicationToolkitCategoryService.getCommunicationToolkitCategoryById(
        id
      );
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "CommunicationToolkitCategory not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CommunicationToolkitCategory retrieved successfully",
      data: result,
    });
  }
);

const updateCommunicationToolkitCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const result =
      await communicationToolkitCategoryService.updateCommunicationToolkitCategory(
        id,
        updateData
      );
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "CommunicationToolkitCategory not found to update",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CommunicationToolkitCategory updated successfully",
      data: result,
    });
  }
);

const softDeleteCommunicationToolkitCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await communicationToolkitCategoryService.softDeleteCommunicationToolkitCategory(
        id
      );
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "CommunicationToolkitCategory not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CommunicationToolkitCategory deleted successfully",
      data: result,
    });
  }
);

export const communicationToolkitCategory_controller = {
  createCommunicationToolkitCategory,
  getAllCommunicationToolkitCategory,
  getCommunicationToolkitCategoryById,
  updateCommunicationToolkitCategory,
  softDeleteCommunicationToolkitCategory,
};
