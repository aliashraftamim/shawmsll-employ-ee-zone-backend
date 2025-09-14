/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { ObjectId, PipelineStage } from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import AppError from "../../../core/error/AppError";
import { monthNames } from "../../../toolkit/helpers/query.halpers";
import { Payment } from "../../base/payment/payment.model";
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

const getEarningsChart = async (year: number) => {
  if (!year) {
    throw new AppError(httpStatus.BAD_REQUEST, "Year is required");
  }

  // Current year data aggregation
  const pipeline: PipelineStage[] = [
    {
      $match: {
        isDeleted: false,
        status: "paid",
        createdAt: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalEarnings: { $sum: "$amount" },
        totalTransactions: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalEarnings: 1,
        totalTransactions: 1,
      },
    },
    { $sort: { month: 1 } },
  ];

  const result = await Payment.aggregate(pipeline);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let prevEarning = 0;
  const monthlyData = monthNames.map((name, idx) => {
    const monthData = result.find((r) => r.month === idx + 1);
    const earning = monthData?.totalEarnings || 0;
    const transactions = monthData?.totalTransactions || 0;

    let growth = null;
    if (idx > 0) {
      growth =
        prevEarning === 0
          ? null
          : ((earning - prevEarning) / prevEarning) * 100;
    }

    prevEarning = earning;

    return {
      month: name,
      totalEarnings: earning,
      totalTransactions: transactions,
      monthlyGrowthPercent: growth,
    };
  });

  // Yearly totals
  const yearlyTotal = monthlyData.reduce((sum, m) => sum + m.totalEarnings, 0);

  const prevYear = year - 1;
  const prevYearResult = await Payment.aggregate([
    {
      $match: {
        isDeleted: false,
        status: "paid",
        createdAt: {
          $gte: new Date(`${prevYear}-01-01T00:00:00.000Z`),
          $lte: new Date(`${prevYear}-12-31T23:59:59.999Z`),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$amount" },
      },
    },
  ]);

  const prevYearTotal = prevYearResult[0]?.totalEarnings || 0;

  // Yearly growth %
  const yearlyGrowthPercent =
    prevYearTotal === 0
      ? null
      : ((yearlyTotal - prevYearTotal) / prevYearTotal) * 100;

  return {
    year,
    yearlyTotal: Number(yearlyTotal?.toFixed(2)),
    yearlyGrowthPercent: Number(yearlyGrowthPercent?.toFixed(2)),
    monthlyData,
  };
};

const totalUserAndEarnings = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const [userStats, paymentStats, thisMonthStats] = await Promise.all([
    User.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, totalUsers: { $sum: 1 } } },
    ]),
    Payment.aggregate([
      { $match: { isDeleted: false, status: "paid" } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$amount" },
          totalSubscriptionsPurchase: { $sum: 1 },
        },
      },
    ]),
    Payment.aggregate([
      {
        $match: {
          isDeleted: false,
          status: "paid",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, totalThisMonth: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    totalUsers: userStats[0]?.totalUsers || 0,
    totalEarnings: paymentStats[0]?.totalEarnings || 0,
    totalSubscriptionsPurchase:
      paymentStats[0]?.totalSubscriptionsPurchase || 0,
    totalThisMonthEarnings: thisMonthStats[0]?.totalThisMonth || 0,
  };
};

const earningHistory = async (query: Record<string, any>) => {
  const earningsQuery = new QueryBuilder(
    Payment.find({
      isDeleted: false,
      status: "paid",
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const result = await earningsQuery.modelQuery.populate(
    "userId",
    "email profile"
  );

  const meta = await earningsQuery.countTotal();

  return { meta, result };
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

export const overviewService = {
  getUserChart,
  updateAdmin,
  getEarningsChart,
  totalUserAndEarnings,
  earningHistory,
};
