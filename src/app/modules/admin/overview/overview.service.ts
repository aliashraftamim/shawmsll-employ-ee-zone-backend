/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose, { ObjectId, PipelineStage } from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { USER_ROLE } from "../../../core/constants/global.constants";
import AppError from "../../../core/error/AppError";
import { Transaction } from "../../../toolkit/classes/stripe/modules/transaction/transaction.model";
import { paginationHelper } from "../../../toolkit/helpers/pagination.helper";
import { monthNames } from "../../../toolkit/helpers/query.halpers";
import pickQuery from "../../../toolkit/utils/query.pick";
import { User } from "../../base/user/user.model";

const getUsers = async (
  currentUser: mongoose.Types.ObjectId,
  query: Record<string, unknown>
) => {
  const { filters, pagination } = await pickQuery(query);
  const paginationFields = paginationHelper.calculatePagination(pagination);
  const { searchTerms, ...filtersData } = filters;
  const pipeline: PipelineStage[] = [];

  // Step 1: Match only active & verified users
  pipeline.push({
    $match: {
      _id: { $ne: currentUser },
      role: { $eq: USER_ROLE.USER },
    },
  });

  // Step 2: Check if current user follows this user
  pipeline.push({
    $lookup: {
      from: "friends",
      let: { targetUserId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$friendId", "$$targetUserId"] },
                {
                  $eq: [
                    "$userId",
                    new mongoose.Types.ObjectId(String(currentUser)),
                  ],
                },
              ],
            },
          },
        },
        { $limit: 1 },
      ],
      as: "myFriendCheck",
    },
  });

  // Step 3: Add isFriend field
  pipeline.push({
    $addFields: {
      isFriend: {
        $cond: {
          if: { $gt: [{ $size: "$myFriendCheck" }, 0] },
          then: true,
          else: false,
        },
      },
    },
  });

  // Step 3.1: Search
  if (searchTerms) {
    pipeline.push({
      $match: {
        $or: [
          { email: { $regex: searchTerms, $options: "i" } },
          { contactNumber: { $regex: searchTerms, $options: "i" } },
          {
            $expr: {
              $regexMatch: {
                input: {
                  $concat: ["$profile.firstName", " ", "$profile.lastName"],
                },
                regex: searchTerms, // এখানে string
                options: "i", // ignore case
              },
            },
          },
        ],
      },
    });
  }

  // Step 3.2: Additional filters
  if (Object.keys(filtersData).length > 0) {
    const filterCopy = { ...filtersData };
    delete filterCopy.sort; // remove sort from filters
    pipeline.push({ $match: filterCopy });
  }

  // Step 3.3: Sorting
  if (filtersData?.sort) {
    const sortField = (filtersData.sort as string).startsWith("-")
      ? (filtersData.sort as string).slice(1)
      : (filtersData.sort as string);
    const sortDirection = (filtersData.sort as string).startsWith("-") ? -1 : 1;
    pipeline.push({ $sort: { [sortField]: sortDirection } });
  }

  // Step 4: Remove unnecessary fields
  pipeline.push({ $project: { myFriendCheck: 0 } });

  // Step 5: Count total before pagination
  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await User.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  // Step 6: Apply pagination
  pipeline.push({ $skip: paginationFields?.skip || 0 });
  pipeline.push({ $limit: paginationFields?.limit || 10 });

  const users = await User.aggregate(pipeline);

  const meta = {
    total,
    page: paginationFields?.page || 1,
    limit: paginationFields?.limit || 10,
  };

  return { meta, data: users };
};

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

  const result = await Transaction.aggregate(pipeline);

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
  const prevYearResult = await Transaction.aggregate([
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
    Transaction.aggregate([
      { $match: { isDeleted: false, status: "paid" } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$amount" },
          totalSubscriptionsPurchase: { $sum: 1 },
        },
      },
    ]),
    Transaction.aggregate([
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
    Transaction.find({
      isDeleted: false,
      status: "paid",
    }),
    query
  )
    .search([])
    .sort()
    .paginate()
    .fields();

  const result = await earningsQuery.modelQuery.populate([
    {
      path: "userId",
      select: "email profile",
    },
    {
      path: "subscriptionId",
    },
  ]);

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
  getUsers,
  getUserChart,
  updateAdmin,
  getEarningsChart,
  totalUserAndEarnings,
  earningHistory,
};
