/* eslint-disable @typescript-eslint/no-explicit-any */
import { addMinutes, parse, subMinutes } from "date-fns";
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { User } from "../../base/user/user.model";
import { ISpecialistSchedule } from "./specialist_schedule.interface";
import { SpecialistSchedule } from "./specialist_schedule.model";

export default class SpecialistScheduleService {
  model = SpecialistSchedule;
  user = User;

  async createSpecialistSchedule(payload: ISpecialistSchedule | any) {
    await this.user.isUserExistById(payload.specialist);

    const scheduleDateTime = parse(
      `${payload.date} ${payload.time}`,
      "yyyy-MM-dd hh:mm a",
      new Date()
    );

    const startTime = subMinutes(scheduleDateTime, 30);
    const endTime = addMinutes(scheduleDateTime, 30);

    const isTimeAvilable = await this.model.findOne({
      specialist: payload.specialist,
      scheduleAt: { $gte: startTime, $lt: endTime },
    });

    if (isTimeAvilable) {
      throw new Error(
        "Specialist already has a schedule within 30 minutes of this time"
      );
    }

    return await this.model.create({
      user: payload.user,
      specialist: payload.specialist,
      scheduleAt: scheduleDateTime,
    });
  }

  async getAllSpecialistSchedule(query: Record<string, any>) {
    const specialistScheduleQuery = new QueryBuilder(
      this.model
        .find({
          isDeleted: { $ne: true },
        })
        .populate("specialist"),
      query
    )
      .search([])
      .sort()
      .paginate()
      .fields();

    const meta = await specialistScheduleQuery.countTotal();
    const data = await specialistScheduleQuery.modelQuery;

    return { meta, data };
  }

  async getSpecialistScheduleById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await this.model
      .findOne({
        _id: id,
        isDeleted: { $ne: true },
      })
      .populate("specialist");
  }

  async updateSpecialistSchedule(
    id: string,
    updateData: Partial<ISpecialistSchedule>
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await this.model.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  }

  async softDeleteSpecialistSchedule(id: string) {
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

export const specialistSchedule_service = new SpecialistScheduleService();
