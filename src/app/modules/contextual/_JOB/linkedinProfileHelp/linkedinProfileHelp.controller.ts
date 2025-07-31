/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../common/utils/catchAsync";
import sendResponse from "../../../../common/utils/sendResponse";
import { linkedinProfileHelp_service } from "./linkedinProfileHelp.service";

const createLinkedinProfileHelp = catchAsync(
  async (req: Request, res: Response) => {
    const result = await linkedinProfileHelp_service.createLinkedinProfileHelp(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "LinkedinProfileHelp created successfully",
      data: result,
    });
  }
);

const getAllLinkedinProfileHelp = catchAsync(
  async (req: Request, res: Response) => {
    const result = await linkedinProfileHelp_service.getAllLinkedinProfileHelp(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "LinkedinProfileHelps retrieved successfully",
      data: result,
    });
  }
);

const getLinkedinProfileHelpById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await linkedinProfileHelp_service.getLinkedinProfileHelpById(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "LinkedinProfileHelp not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "LinkedinProfileHelp retrieved successfully",
      data: result,
    });
  }
);

const updateLinkedinProfileHelp = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await linkedinProfileHelp_service.updateLinkedinProfileHelp(
      id,
      updateData
    );
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "LinkedinProfileHelp not found to update",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "LinkedinProfileHelp updated successfully",
      data: result,
    });
  }
);

const softDeleteLinkedinProfileHelp = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await linkedinProfileHelp_service.softDeleteLinkedinProfileHelp(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "LinkedinProfileHelp not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "LinkedinProfileHelp deleted successfully",
      data: result,
    });
  }
);

export const linkedinProfileHelp_controller = {
  createLinkedinProfileHelp,
  getAllLinkedinProfileHelp,
  getLinkedinProfileHelpById,
  updateLinkedinProfileHelp,
  softDeleteLinkedinProfileHelp,
};
