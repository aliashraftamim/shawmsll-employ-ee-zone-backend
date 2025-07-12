/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { guidance_service } from "./guidance.service";

const createGuidance = catchAsync(async (req, res) => {
  const result = await guidance_service.createGuidance(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guidance is created successful!",
    data: result,
  });
});

export const guidance_controller = {
  createGuidance,
};
