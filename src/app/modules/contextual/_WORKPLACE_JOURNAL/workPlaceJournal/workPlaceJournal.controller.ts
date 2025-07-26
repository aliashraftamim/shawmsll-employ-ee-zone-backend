/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import catchAsync from "../../../../common/utils/catchAsync";
import sendResponse from "../../../../common/utils/sendResponse";
import { workPlaceJournal_service } from "./workPlaceJournal.service";

// ✅ Create
const createWorksJournal = catchAsync(async (req, res) => {
  const result = await workPlaceJournal_service.createWorksJournal(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Workplace journal created successfully!",
    data: result,
  });
});

// ✅ Get (with filters, pagination etc.)
const getWorkplaceJournal = catchAsync(async (req, res) => {
  const result = await workPlaceJournal_service.getWorkplaceJournal(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Workplace journal retrieved successfully!",
    data: result,
  });
});

const getSingleWorkplaceJournal = catchAsync(async (req, res) => {
  const result = await workPlaceJournal_service.getSingleWorkplaceJournal(
    req.params.id as any
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Workplace journal retrieved successfully!",
    data: result,
  });
});

// ✅ Update
const updateWorkplaceJournal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const objectId = new mongoose.Types.ObjectId(id);
  const result = await workPlaceJournal_service.updateWorkplaceJournal(
    objectId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Workplace journal updated successfully!",
    data: result,
  });
});

// ✅ Soft Delete
const deleteWorkplaceJournal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const objectId = new mongoose.Types.ObjectId(id);
  const result =
    await workPlaceJournal_service.deleteWorkplaceJournal(objectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Workplace journal deleted successfully!",
    data: result,
  });
});

export const workPlaceJournal_controller = {
  createWorksJournal,
  getWorkplaceJournal,
  getSingleWorkplaceJournal,
  updateWorkplaceJournal,
  deleteWorkplaceJournal,
};
