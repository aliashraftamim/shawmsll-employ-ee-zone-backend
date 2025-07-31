/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../common/utils/catchAsync";
import sendResponse from "../../../../common/utils/sendResponse";
import { interviewPrep_service } from "./interviewPrep.service";

const createInterviewPrep = catchAsync(async (req: Request, res: Response) => {
  const result = await interviewPrep_service.createInterviewPrep(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "InterviewPrep created successfully",
    data: result,
  });
});

const getAllInterviewPrep = catchAsync(async (req: Request, res: Response) => {
  const result = await interviewPrep_service.getAllInterviewPrep(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "InterviewPreps retrieved successfully",
    data: result,
  });
});

const getInterviewPrepById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await interviewPrep_service.getInterviewPrepById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "InterviewPrep not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "InterviewPrep retrieved successfully",
    data: result,
  });
});

const updateInterviewPrep = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await interviewPrep_service.updateInterviewPrep(
    id,
    updateData
  );
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "InterviewPrep not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "InterviewPrep updated successfully",
    data: result,
  });
});

const softDeleteInterviewPrep = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await interviewPrep_service.softDeleteInterviewPrep(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "InterviewPrep not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "InterviewPrep deleted successfully",
      data: result,
    });
  }
);

export const interviewPrep_controller = {
  createInterviewPrep,
  getAllInterviewPrep,
  getInterviewPrepById,
  updateInterviewPrep,
  softDeleteInterviewPrep,
};
