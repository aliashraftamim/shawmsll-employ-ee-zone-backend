/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { ObjectId } from "mongoose";
import { monthNames } from "../../../common/helpers/query.halpers";
import AppError from "../../../core/error/AppError";
import { User } from "../../base/user/user.model";

const getUserChart = async (
  year: string = new Date().getFullYear().toString()
) => {
  const allMonths = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    count: 0,
  }));

  const userStats = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01T00:00:00Z`),
          $lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  const chartData = allMonths.map((monthData) => {
    const found = userStats.find((stat) => stat._id.month === monthData.month);
    return {
      month: monthNames[monthData.month - 1],
      count: found ? found.count : 0,
    };
  });

  return { year, chartData };
};

const updateAdmin = async (adminId: ObjectId, payload: any) => {
  if (payload?.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Don't allow to change email directly!"
    );
  }
  if (payload?.phoneNumber) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Don't allow to change phone number directly!"
    );
  }
  if (payload?.userName) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Don't allow to change userName directly!"
    );
  }

  const result = User.findByIdAndUpdate(adminId, payload, { new: true });

  return result;
};

export const overviewService = { getUserChart, updateAdmin };
