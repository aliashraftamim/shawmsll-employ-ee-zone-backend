/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../../core/builders/QueryBuilder";
import { INotification } from "./notification.interface";
import Notification from "./notification.model";

const getNotificationFromDb = async (query: Record<string, any>) => {
  const notificationQuery = new QueryBuilder(Notification.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await notificationQuery.modelQuery;
  return data;
};

const updateNotification = async (
  id: string,
  payload: Partial<INotification>
) => {
  const result = await Notification.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const makeMeRead = async (query: { user: any; notId: string }) => {
  const result = await Notification.findOneAndUpdate(
    { _id: query.notId, receiver: query.user },
    { isRead: true },
    { new: true }
  );
  return result;
};

const markAllMyNotificationRead = async (userId: mongoose.Types.ObjectId) => {
  const result = await Notification.updateMany(
    { receiver: userId },
    { isRead: true },
    { }
  );
  return result;
};

const deleteNotification = async (notId: mongoose.Types.ObjectId) => {
  return await Notification.findByIdAndDelete(notId);
};

const deleteOldNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
    });

    console.info(`✅ Old notifications removed: ${result.deletedCount}`);
    return result.deletedCount;
  } catch (err) {
    console.error("❌ Error removing old notifications:", err);
    throw err;
  }
};

export const notificationServices = {
  getNotificationFromDb,
  updateNotification,
  makeMeRead,
  markAllMyNotificationRead,
  deleteNotification,
  deleteOldNotifications,
};
