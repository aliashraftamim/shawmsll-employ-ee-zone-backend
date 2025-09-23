/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../toolkit/utils/catchAsync";
import sendResponse from "../../../../toolkit/utils/sendResponse";
import { guidanceSuggestion_service } from "./guidance_suggestion.service";

const createGuidanceSuggestion = catchAsync(
  async (req: Request, res: Response) => {
    const result = await guidanceSuggestion_service.createGuidanceSuggestion(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "GuidanceSuggestion created successfully",
      data: result,
    });
  }
);

const getAllGuidanceSuggestion = catchAsync(
  async (req: Request, res: Response) => {
    const result = await guidanceSuggestion_service.getAllGuidanceSuggestion(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "GuidanceSuggestions retrieved successfully",
      data: result,
    });
  }
);

const guidanceSuggestionByCategoryAndScenario = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await guidanceSuggestion_service.guidanceSuggestionByCategoryAndScenario(
        req.query
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "GuidanceSuggestions retrieved successfully",
      data: result,
    });
  }
);

const getGuidanceSuggestionById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await guidanceSuggestion_service.getGuidanceSuggestionById(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "GuidanceSuggestion not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "GuidanceSuggestion retrieved successfully",
      data: result,
    });
  }
);

const updateGuidanceSuggestion = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await guidanceSuggestion_service.updateGuidanceSuggestion(
      id,
      updateData
    );
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "GuidanceSuggestion not found to update",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "GuidanceSuggestion updated successfully",
      data: result,
    });
  }
);

const softDeleteGuidanceSuggestion = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await guidanceSuggestion_service.softDeleteGuidanceSuggestion(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "GuidanceSuggestion not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "GuidanceSuggestion deleted successfully",
      data: result,
    });
  }
);

export const guidanceSuggestion_controller = {
  createGuidanceSuggestion,
  getAllGuidanceSuggestion,
  getGuidanceSuggestionById,
  updateGuidanceSuggestion,
  softDeleteGuidanceSuggestion,
  guidanceSuggestionByCategoryAndScenario,
};
