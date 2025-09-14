/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import catchAsync from "../../../toolkit/utils/catchAsync";
import sendResponse from "../../../toolkit/utils/sendResponse";
import { overviewService } from "./overview.service";

const getUserChart = catchAsync(async (req, res) => {
  const result = await overviewService.getUserChart(req.query.year as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User chart retrieved successful!",
    data: result,
  });
});

const getEarningsChart = catchAsync(async (req, res) => {
  const result = await overviewService.getEarningsChart(req.query.year as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Earning chart retrieved successful!",
    data: result,
  });
});

const totalUserAndEarnings = catchAsync(async (req, res) => {
  const result = await overviewService.totalUserAndEarnings();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Earning chart retrieved successful!",
    data: result,
  });
});

const earningHistory = catchAsync(async (req, res) => {
  const result = await overviewService.earningHistory(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Earning chart retrieved successful!",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const result = await overviewService.updateAdmin(
    req.user.id as any,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin updated successful!",
    data: result,
  });
});

export const overviewController = {
  getUserChart,
  updateAdmin,
  getEarningsChart,
  totalUserAndEarnings,
  earningHistory,
};
