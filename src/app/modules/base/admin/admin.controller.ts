import httpStatus from "http-status";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { adminService } from "./admin.service";

const getSupperAdmin = catchAsync(async (req, res) => {
  const result = await adminService.getSupperAdmin();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin retrieved successful",
    data: result,
  });
});

export const adminController = {
  getSupperAdmin,
};
