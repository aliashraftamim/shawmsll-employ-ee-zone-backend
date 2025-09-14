/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";
import { USER_ROLE } from "../../../core/constants/global.constants";

export interface INotification {
  receiver: mongoose.Types.ObjectId | undefined;
  receiverEmail: string | undefined;
  receiverRole: keyof typeof USER_ROLE;
  message: string;

  sender?: mongoose.Types.ObjectId | undefined;
  fcmToken?: string;
  type?: "hireRequest" | "accept" | "reject" | "cancelled" | "payment";
  title?: string;
  isRead?: boolean;
  link?: string;
}
