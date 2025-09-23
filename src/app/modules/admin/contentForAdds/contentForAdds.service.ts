/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { IUser } from "../../base/user/user.interface";
import { User } from "../../base/user/user.model";
import { ContentForAddsSchedule } from "./contentForAdds.const";
import { IContentForAdds } from "./contentForAdds.interface";
import { ContentForAdds } from "./contentForAdds.model";

const createContentForAdds = async (payload: IContentForAdds | any) => {
  const content = await ContentForAdds.create(payload);

  const filter: Partial<IUser> | any = { isDeleted: false };

  if (!payload.targetUsers.premiumUser && payload.targetUsers.freePlanUser) {
    filter["payment.status"] = { $ne: "paid" };
  }
  if (!payload.targetUsers.freePlanUser && payload.targetUsers.premiumUser) {
    filter["payment.status"] = "paid";
  }

  const targetedUsers: any[] = await User.find(filter).select(
    "payment.status fcmToken email"
  );
  const fcmTokens: string[] = targetedUsers
    .map((user) => user.fcmToken)
    .filter((token): token is string => token !== undefined);

  payload.fcmTokens = fcmTokens;
  if (content?.status === "active") {
    ContentForAddsSchedule(payload);
  }

  return await User.find(filter).select("payment.status fcmToken email");
};

const getAllContentForAdds = async (query: Record<string, any>) => {
  const contentForAddsQuery = new QueryBuilder(
    ContentForAdds.find({
      isDeleted: { $ne: true },
    }),
    query
  )
    .search(["content", "contentType"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await contentForAddsQuery.countTotal();
  const data = await contentForAddsQuery.modelQuery;

  return { meta, data };
};

const getContentForAddsById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ContentForAdds.findOne({ _id: id, isDeleted: { $ne: true } });
};

const updateContentForAdds = async (
  id: string,
  updateData: Partial<IContentForAdds>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ContentForAdds.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteContentForAdds = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
  return await ContentForAdds.findByIdAndDelete(id);
};

export const contentForAdds_service = {
  createContentForAdds,
  getAllContentForAdds,
  getContentForAddsById,
  updateContentForAdds,
  deleteContentForAdds,
};
