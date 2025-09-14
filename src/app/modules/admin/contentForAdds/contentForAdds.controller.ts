/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../toolkit/utils/catchAsync";
import sendResponse from "../../../toolkit/utils/sendResponse";
import { contentForAdds_service } from "./contentForAdds.service";

const createContentForAdds = catchAsync(async (req: Request, res: Response) => {
  const result = await contentForAdds_service.createContentForAdds(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "ContentForAdds created successfully",
    data: result,
  });
});

const getAllContentForAdds = catchAsync(async (req: Request, res: Response) => {
  const result = await contentForAdds_service.getAllContentForAdds(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ContentForAdds retrieved successfully",
    data: result,
  });
});

const getContentForAddsById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await contentForAdds_service.getContentForAddsById(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "ContentForAdds not found",
        data: result,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "ContentForAdds retrieved successfully",
      data: result,
    });
  }
);

const updateContentForAdds = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await contentForAdds_service.updateContentForAdds(
    id,
    updateData
  );
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "ContentForAdds not found to update",
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ContentForAdds updated successfully",
    data: result,
  });
});

const softDeleteContentForAdds = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await contentForAdds_service.softDeleteContentForAdds(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "ContentForAdds not found to delete",
        data: undefined,
      });
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "ContentForAdds deleted successfully",
      data: result,
    });
  }
);

export const contentForAdds_controller = {
  createContentForAdds,
  getAllContentForAdds,
  getContentForAddsById,
  updateContentForAdds,
  softDeleteContentForAdds,
};
