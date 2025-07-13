/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { workPlaceJournal_service } from "./workPlaceJournal.service";

const createWorksJournal = catchAsync(async (req, res) => {
  const result = await workPlaceJournal_service.createWorksJournal(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Works place journal created successful!",
    data: result,
  });
});

export const workPlaceJournal_controller = {
  createWorksJournal,
};
