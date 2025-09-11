/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";

export interface INotification {
  receiver: mongoose.Types.ObjectId | undefined;
  receiverEmail: string | undefined;
  receiverRole: "buyer" | "seller" | "admin";
  message: string;

  sender?: mongoose.Types.ObjectId | undefined;
  fcmToken?: string;
  type?: "hireRequest" | "accept" | "reject" | "cancelled" | "payment";
  title?: string;
  isRead?: boolean;
  link?: string;
}

// export interface ISendNotification {
//   sender: string | undefined;
//   receiver: string | undefined;
//   receiverEmail: string | undefined;
//   receiverRole: string | undefined;
//   title: string;
//   link: string | null;
//   message: string;
//   type?: "hireRequest" | "accept" | "reject" | "cancelled" | "payment";
// }
