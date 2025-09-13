/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { BaseController } from "../../../toolkit/classes/root.controller";
import { hrAdmin_service } from "./hr-admin.service";

export class HrAdminController extends BaseController<typeof hrAdmin_service> {
  constructor() {
    super(hrAdmin_service, "HrAdmin");
  }

  async createHrAdmin(req: Request, res: Response, next: NextFunction) {
    const result = await this.service.createHrAdmin(req.body);
    this.handleResponse(
      res,
      httpStatus.CREATED,
      true,
      `${this.resourceName} created successfully`,
      result
    );
  }

  async getAllHrAdmin(req: Request, res: Response, next: NextFunction) {
    const result = await this.service.getAllHrAdmin(req.query);
    this.handleResponse(
      res,
      httpStatus.OK,
      true,
      `${this.resourceName}s retrieved successfully`,
      result
    );
  }

  async getHrAdminById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = await this.service.getHrAdminById(id);
    if (!result) {
      return this.handleResponse(
        res,
        httpStatus.NOT_FOUND,
        false,
        `${this.resourceName} not found`
      );
    }
    this.handleResponse(
      res,
      httpStatus.OK,
      true,
      `${this.resourceName} retrieved successfully`,
      result
    );
  }

  async updateHrAdmin(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user;
    const result = await this.service.updateHrAdmin(id, req.body);

    this.handleResponse(
      res,
      httpStatus.OK,
      true,
      `${this.resourceName} updated successfully`,
      result
    );
  }

  async softDeleteHrAdmin(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = await this.service.softDeleteHrAdmin(id);
    if (!result) {
      return this.handleResponse(
        res,
        httpStatus.NOT_FOUND,
        false,
        `${this.resourceName} not found to delete`
      );
    }
    this.handleResponse(
      res,
      httpStatus.OK,
      true,
      `${this.resourceName} deleted successfully`,
      result
    );
  }
}

// Export instance
export const hrAdmin_controller = new HrAdminController();
