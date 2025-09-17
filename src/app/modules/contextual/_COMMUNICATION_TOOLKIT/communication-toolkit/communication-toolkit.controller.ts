/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../toolkit/utils/catchAsync";
import sendResponse from "../../../../toolkit/utils/sendResponse";
import { communicationToolkitService } from "./communication-toolkit.service";

const createCommunicationToolkit = catchAsync(
  async (req: Request, res: Response) => {
    const result = await communicationToolkitService.createCommunicationToolkit(
      req.user.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "CommunicationToolkit created successfully",
      data: result,
    });
  }
);

const getAllCommunicationToolkit = catchAsync(
  async (req: Request, res: Response) => {
    const result = await communicationToolkitService.getAllCommunicationToolkit(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CommunicationToolkits retrieved successfully",
      data: result,
    });
  }
);

const getCommunicationToolkitById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await communicationToolkitService.getCommunicationToolkitById(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "CommunicationToolkit not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CommunicationToolkit retrieved successfully",
      data: result,
    });
  }
);

const updateCommunicationToolkit = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await communicationToolkitService.updateCommunicationToolkit(
      id,
      updateData
    );
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "CommunicationToolkit not found to update",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CommunicationToolkit updated successfully",
      data: result,
    });
  }
);

const softDeleteCommunicationToolkit = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await communicationToolkitService.softDeleteCommunicationToolkit(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "CommunicationToolkit not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CommunicationToolkit deleted successfully",
      data: result,
    });
  }
);

export const communicationToolkit_controller = {
  createCommunicationToolkit,
  getAllCommunicationToolkit,
  getCommunicationToolkitById,
  updateCommunicationToolkit,
  softDeleteCommunicationToolkit,
};
