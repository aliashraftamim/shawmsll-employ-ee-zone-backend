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

type THrAdminPayload = IHrAdmin & IUser;

const createHrAdmin = async (payload: Partial<THrAdminPayload>) => {
  const session = await startSession();
  session.startTransaction();
  try {
    // 1️⃣ Create User
    const newUser = await new User({
      email: payload.email,
      password: payload.password,
      role: USER_ROLE.HR,
      agreeToTerms: true,
      verification: { verified: true },
      confirmPassword: payload.password,
    }).save({ session });

    // 2️⃣ Create HR Admin
    const newHR = await new HrAdmin({
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
};

const getAllHrAdmin = async (query: Record<string, any>) => {
  const hrAdminQuery = new QueryBuilder(
    HrAdmin.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const meta = await hrAdminQuery.countTotal();
  const data = await hrAdminQuery.modelQuery;

  return { meta, data };
};

const getHrAdminById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await HrAdmin.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateHrAdmin = async (id: string, updateData: Partial<IHrAdmin>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await HrAdmin.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteHrAdmin = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await HrAdmin.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const hrAdmin_service = {
  createHrAdmin,
  getAllHrAdmin,
  getHrAdminById,
  updateHrAdmin,
  softDeleteHrAdmin,
};
