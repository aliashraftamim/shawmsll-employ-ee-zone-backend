/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { transaction_service } from "./transaction.service";

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await transaction_service.createTransaction(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Transaction created successfully",
    data: result,
  });
});

const getAllTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await transaction_service.getAllTransaction(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transactions retrieved successfully",
    data: result,
  });
});

const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await transaction_service.getTransactionById(id);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Transaction not found",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction retrieved successfully",
    data: result,
  });
});

const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await transaction_service.updateTransaction(id, updateData);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Transaction not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction updated successfully",
    data: result,
  });
});

const softDeleteTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await transaction_service.softDeleteTransaction(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Transaction not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transaction deleted successfully",
      data: result,
    });
  }
);

export const transaction_controller = {
  createTransaction,
  getAllTransaction,
  getTransactionById,
  updateTransaction,
  softDeleteTransaction,
};
