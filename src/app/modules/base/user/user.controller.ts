/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";

import mongoose from "mongoose";
import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { userService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller created successfully!!",
    data: result,
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUsers(req.user.id, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller retrieve successfully!!",
    data: result,
  });
});

const usersForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.usersForAdmin(req.user.id, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller retrieve successfully!!",
    data: result,
  });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.updateMe(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller created successfully!!",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getMe(req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller created successfully!!",
    data: result,
  });
});

const BlockUser = catchAsync(async (req: Request, res: Response) => {
  const blockedQuery = req.query.blocked;
  if (blockedQuery !== "true" && blockedQuery !== "false") {
    return res.status(400).json({
      success: false,
      message: 'Query param "blocked" must be "true" or "false"',
    });
  }

  const blocked = blockedQuery === "true";

  const result = await userService.BlockUser(
    new mongoose.Types.ObjectId(req.params.id),
    blocked
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User blocked successfully!!",
    data: result,
  });
});

export const userController = {
  createUser,
  getUser,
  getMe,
  updateMe,
  BlockUser,
  usersForAdmin,
};
