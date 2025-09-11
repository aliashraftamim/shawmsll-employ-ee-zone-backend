/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { payment_service } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await payment_service.createPayment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

const getAllPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await payment_service.getAllPayment(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await payment_service.getPaymentById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Payment not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await payment_service.updatePayment(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Payment not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment updated successfully",
    data: result,
  });
});

const softDeletePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await payment_service.softDeletePayment(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Payment not found to delete",
      data: undefined,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment deleted successfully",
    data: result,
  });
});

export const payment_controller = {
  createPayment,
  getAllPayment,
  getPaymentById,
  updatePayment,
  softDeletePayment,
};
