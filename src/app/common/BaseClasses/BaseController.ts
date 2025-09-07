/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

export abstract class BaseController<TService> {
  protected service: TService;
  protected resourceName: string;

  constructor(service: TService, resourceName: string) {
    this.service = service;
    this.resourceName = resourceName;

    // Automatically wrap all async methods with catchAsync
    const proto = Object.getPrototypeOf(this);
    Object.getOwnPropertyNames(proto).forEach((methodName) => {
      if (
        methodName !== "constructor" &&
        typeof (this as any)[methodName] === "function"
      ) {
        (this as any)[methodName] = catchAsync(
          (this as any)[methodName].bind(this)
        );
      }
    });
  }

  protected handleResponse(
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data?: any
  ) {
    return sendResponse(res, { statusCode, success, message, data });
  }
}
