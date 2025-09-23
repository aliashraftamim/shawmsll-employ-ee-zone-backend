import { JobSearchHelp } from "./job_search_help.model";
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../../core/builders/QueryBuilder";
import { IJobSearchHelp } from "./job_search_help.interface";

export class JobSearchHelpService {
  private model = JobSearchHelp;

  async create(payload: IJobSearchHelp) {
    return await this.model.create(payload);
  }

  async getAll(query: Record<string, any>) {
    const jobSearchHelpQuery = new QueryBuilder(
      this.model.find({
        isDeleted: { $ne: true },
      }),
      query
    )
      .search(["name"])
      .sort()
      .paginate()
      .fields();

    const meta = await jobSearchHelpQuery.countTotal();
    const data = await jobSearchHelpQuery.modelQuery;

    return { meta, data };
  }

  async getSingle(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await this.model.findOne({ _id: id, isDeleted: { $ne: true } });
  }

  async update(id: string, updateData: Partial<IJobSearchHelp>) {
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

export const jobSearchHelpService = new JobSearchHelpService();
