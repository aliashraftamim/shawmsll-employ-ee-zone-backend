/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { User } from "../user/user.model";
import { sendNotification } from "./notification.utils";

export interface IAdminSendNotificationPayload {
  sender?: mongoose.Types.ObjectId | undefined;
  type?: "hireRequest" | "accept" | "reject" | "cancelled" | "payment";
  title: string;
  message: string;
  link?: string;
}

export const sendAdminNotifications = async (
  payload: IAdminSendNotificationPayload
) => {
  const admins = await User.find({
    role: USER_ROLE.SUPPER_ADMIN,
    "verification.verified": true,
    isDeleted: false,
    status: "active",
  }).select("fcmToken email _id");

  if (!admins.length) return;

  admins.forEach((admin) => {
    if (admin?.fcmToken) {
      sendNotification([admin.fcmToken], {
        sender: payload.sender,
        receiver: admin._id as any,
        receiverEmail: admin.email,
        receiverRole: USER_ROLE.SUPPER_ADMIN,
        title: payload.title,
        message: payload.message,
        type: payload.type as any,
        link: payload.link,
      });
    }
  });
};
