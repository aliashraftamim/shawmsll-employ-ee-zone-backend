/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../../toolkit/utils/catchAsync";
import sendResponse from "../../../../../toolkit/utils/sendResponse";
import { ctTemplate_service } from "./ctTemplate.service";

const createCtTemplate = catchAsync(async (req: Request, res: Response) => {
  const result = await ctTemplate_service.create(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "CtTemplate created successfully",
    data: result,
  });
});

const getAllCtTemplate = catchAsync(async (req: Request, res: Response) => {
  const result = await ctTemplate_service.getAll(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CtTemplates retrieved successfully",
    data: result,
  });
});

const getCtTemplateById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ctTemplate_service.getById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "CtTemplate not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CtTemplate retrieved successfully",
    data: result,
  });
});

const updateCtTemplate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await ctTemplate_service.update(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "CtTemplate not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CtTemplate updated successfully",
    data: result,
  });
});

const softDeleteCtTemplate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ctTemplate_service.softDelete(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "CtTemplate not found to delete",
      data: undefined,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CtTemplate deleted successfully",
    data: result,
  });
});

export const ctTemplate_controller = {
  createCtTemplate,
  getAllCtTemplate,
  getCtTemplateById,
  updateCtTemplate,
  softDeleteCtTemplate,
};
