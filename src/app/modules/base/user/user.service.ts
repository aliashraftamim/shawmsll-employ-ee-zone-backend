/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { ObjectId, PipelineStage } from "mongoose";

import { USER_ROLE } from "../../../core/constants/global.constants";
import { paginationHelper } from "../../../toolkit/helpers/pagination.helper";
import pickQuery from "../../../toolkit/utils/query.pick";
import { authService } from "../auth/auth.service";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const userData = {
    ...payload,
    role: USER_ROLE.USER,
    verification: { verified: false },
    subscription: { plan: "free" },
  };

  const newUser = await User.create([{ ...userData }]);

  const verifyEmail: any = await authService.sendOtpForVerifyEmail(
    payload?.email as any
  );
  return {
    user: newUser[0],
    verifyEmailToken: verifyEmail?.verifyEmailToken,
  }; // Return the created user
};

const getUsers = async (
  currentUser: ObjectId,
  query: Record<string, unknown>
) => {
  const { filters, pagination } = await pickQuery(query);
  const paginationFields = paginationHelper.calculatePagination(pagination);
  const { searchTerms, ...filtersData } = filters;
  const pipeline: PipelineStage[] = [];

  // Step 1: Match only active & verified users
  pipeline.push({
    $match: {
      isDeleted: false,
      status: { $ne: "blocked" },
      "verification.verified": true,
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

const usersForAdmin = async (
  currentUser: ObjectId,
  query: Record<string, unknown>
) => {
  const { filters, pagination } = await pickQuery(query);
  const paginationFields = paginationHelper.calculatePagination(pagination);
  const { searchTerms, ...filtersData } = filters;
  const pipeline: PipelineStage[] = [];

  // Step 1: Match only active & verified users
  pipeline.push({
    $match: {
      isDeleted: false,
      "verification.verified": true,
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

// const getSingleUser = async() => {};

const updateMe = async (userId: ObjectId, payload: Partial<IUser> | any) => {
  const updateData: any = {};

  // profileImage update করলে শুধু nested field use করো
  if (payload?.profileImage) {
    updateData["profile.profileImage"] = payload.profileImage;
  }

  // location update
  if (payload?.location?.coordinates) {
    updateData["location"] = {
      type: "Point",
      coordinates: payload.location.coordinates,
    };
  }

  // অন্য non-nested fields
  for (const key of Object.keys(payload)) {
    if (!["profileImage", "location", "profile"].includes(key)) {
      updateData[key] = payload[key];
    }
  }

  console.log("🚀 ~ updateMe ~ updateData:", updateData);

  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  );
};

const getMe = async (currentUser: ObjectId) => {
  // Step 1: Match only active & verified users

  return await User.findById(currentUser);
};

const BlockUser = async (userId: mongoose.Types.ObjectId, blocked: boolean) => {
  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { status: blocked ? "blocked" : "active" },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export const userService = {
  createUser,
  getUsers,
  updateMe,
  getMe,
  BlockUser,
  usersForAdmin,
};
