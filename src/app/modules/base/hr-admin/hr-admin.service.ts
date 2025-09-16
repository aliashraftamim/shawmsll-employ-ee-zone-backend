/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose, { startSession } from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { USER_ROLE } from "../../../core/constants/global.constants";
import AppError from "../../../core/error/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { IHrAdmin } from "./hr-admin.interface";
import { HrAdmin } from "./hr-admin.model";

type THrAdminPayload = IHrAdmin & IUser & any;

export default class HrAdminService {
  model = HrAdmin;
  userModel = User;

  async createHrAdmin(payload: Partial<THrAdminPayload>) {
    const session = await startSession();
    session.startTransaction();
    try {
      // 1️⃣ Create User
      const newUser = await new this.userModel({
        email: payload.email,
        password: payload.password,
        "profile.phoneNumber": payload.phoneNumber,
        "profile.firstName": payload.firstName || "HR Specialist",
        "profile.lastName": payload.lastName || "By Supper Admin",
        "profile.profileImage": payload.profileImage,
        role: USER_ROLE.HR,
        agreeToTerms: true,
        verification: { verified: true },
        confirmPassword: payload.password,
      }).save({ session });

      // 2️⃣ Create HR Admin
      const newHR = await new this.model({
        ...payload,
        user: newUser._id,
        documents: payload.documents,
      }).save({ session });

      await session.commitTransaction();
      return newHR;
    } catch (error: any) {
      await session.abortTransaction();
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Error creating HR Admin"
      );
    } finally {
      await session.endSession();
    }
  }
  async updateHrAdmin(id: string, updateData: Partial<THrAdminPayload>) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const session = await startSession();
    session.startTransaction();

    try {
      // 1️⃣ Update User part if present in updateData
      if (
        updateData.email ||
        updateData.password ||
        updateData.firstName ||
        updateData.lastName ||
        updateData.phoneNumber
      ) {
        const userUpdate: any = {};
        if (updateData.email) {
          userUpdate.email = updateData.email;
        }
        if (updateData.password) {
          userUpdate.password = updateData.password;
        }
        if (updateData.firstName) {
          userUpdate["profile.firstName"] = updateData.firstName;
        }
        if (updateData.lastName) {
          userUpdate["profile.lastName"] = updateData.lastName;
        }
        if (updateData.phoneNumber) {
          userUpdate["profile.phoneNumber"] = updateData.phoneNumber;
        }

        const hrAdmin = await this.model
          .findById(new mongoose.Types.ObjectId(id))
          .session(session);
        if (!hrAdmin) throw new Error("HR Admin not found");

        await this.userModel.findByIdAndUpdate(hrAdmin.user, userUpdate, {
          new: true,
          session,
        });
      }

      // 2️⃣ Update HR Admin data
      const updatedHR = await this.model.findByIdAndUpdate(
        new mongoose.Types.ObjectId(id),
        updateData,
        {
          new: true,
          session,
        }
      );

      await session.commitTransaction();
      return updatedHR;
    } catch (error: any) {
      await session.abortTransaction();
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Error updating HR Admin"
      );
    } finally {
      await session.endSession();
    }
  }

  async getAllHrAdmin(query: Record<string, any>) {
    const filter: Record<string, any> = {
      isDeleted: { $ne: true },
    };

    if (query?.expertise) {
      const expertiseArray = Array.isArray(query.expertise)
        ? query.expertise
        : query.expertise.split(",");

      filter.expertise = { $in: expertiseArray };
    }

    const hrAdminQuery = new QueryBuilder(
      this.model.find(filter).populate({
        path: "user",
        select: "email profile",
      }),
      query
    )
      .search([])
      .sort()
      .paginate()
      .fields();

    const meta = await hrAdminQuery.countTotal();
    const data = await hrAdminQuery.modelQuery.select("+createdAt");

    return { meta, data };
  }

  async getHrAdminById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await this.model
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .populate({
        path: "user",
        select: "email profile",
      });
  }

  async softDeleteHrAdmin(id: string) {
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

export const hrAdmin_service = new HrAdminService();
