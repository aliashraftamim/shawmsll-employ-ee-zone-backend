/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../../../../core/builders/QueryBuilder";
import AppError from "../../../../../core/error/AppError";
import { ICtTemplate } from "./ctTemplate.interface";
import { CtTemplate } from "./ctTemplate.model";

export class CtTemplateService {
  private model;

  constructor() {
    this.model = CtTemplate;
  }

  async create(payload: ICtTemplate) {
    return await this.model.create(payload);
  }

  async getAll(query: Record<string, any>) {
    const ctTemplateQuery = new QueryBuilder(
      this.model.find({ isDeleted: { $ne: true } }),
      query
    )
      .search([])
      .sort()
      .paginate()
      .fields();

    const meta = await ctTemplateQuery.countTotal();
    const data = await ctTemplateQuery.modelQuery;

    return { meta, data };
  }

  async getById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid ID");
    }
    return await this.model.findOne({ _id: id, isDeleted: { $ne: true } });
  }

  async update(id: string, updateData: Partial<ICtTemplate>) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async softDelete(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await this.model.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}

export const ctTemplate_service = new CtTemplateService();
