/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../toolkit/utils/catchAsync";
import sendResponse from "../../../toolkit/utils/sendResponse";
import { specialistSchedule_service } from "./specialist_schedule.service";

const createSpecialistSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    payload.user = req.user.id;

    const result =
      await specialistSchedule_service.createSpecialistSchedule(payload);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "SpecialistSchedule created successfully",
      data: result,
    });
  }
);

const getAllSpecialistSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const result = await specialistSchedule_service.getAllSpecialistSchedule(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SpecialistSchedules retrieved successfully",
      data: result,
    });
  }
);

const getSpecialistScheduleById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await specialistSchedule_service.getSpecialistScheduleById(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "SpecialistSchedule not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SpecialistSchedule retrieved successfully",
      data: result,
    });
  }
);

const updateSpecialistSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await specialistSchedule_service.updateSpecialistSchedule(
      id,
      updateData
    );
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "SpecialistSchedule not found to update",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SpecialistSchedule updated successfully",
      data: result,
    });
  }
);

const softDeleteSpecialistSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await specialistSchedule_service.softDeleteSpecialistSchedule(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "SpecialistSchedule not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SpecialistSchedule deleted successfully",
      data: result,
    });
  }
);

export const specialistSchedule_controller = {
  createSpecialistSchedule,
  getAllSpecialistSchedule,
  getSpecialistScheduleById,
  updateSpecialistSchedule,
  softDeleteSpecialistSchedule,
};
