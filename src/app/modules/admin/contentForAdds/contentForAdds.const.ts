/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import httpStatus from "http-status";
import { notificationAddsQueue } from "../../../core/background-worker/queue";
import AppError from "../../../core/error/AppError";
import { sendNotification } from "../../base/notification/notification.utils";
import { IContentForAdds } from "./contentForAdds.interface";

// 2️⃣ Schedule a job safely
export const ContentForAddsSchedule = async (
  adds: Partial<IContentForAdds | any>
) => {
  try {
    if (!adds.date || !adds.time || !adds.content) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Missing required data in schedule for send notification"
      );
    }

    const scheduleDate = new Date(`${adds.date} ${adds.time}`);
    const delay = scheduleDate.getTime() - Date.now();
    if (delay <= 0) {
      console.info("⚠️ Schedule time already passed, sending immediately...");
      await sendAdsNotification({
        id: adds._id,
        fcmTokens: adds.fcmTokens,
        title: adds.content,
        image: adds?.image,
      });
      return;
    }

    await notificationAddsQueue.add(
      "send",
      {
        id: adds._id,
        fcmTokens: adds.fcmTokens,
        title: adds.content,
        image: adds?.image,
      },
      { delay }
    );
  } catch (err: any) {
    console.error("❌ Error in ContentForAddsSchedule:", err.message || err);
  }
};

// 4️⃣ Notification logic (reusable function)
const sendAdsNotification = async (data: any) => {
  const { fcmTokens, title, content } = data;
  try {
    await sendNotification(fcmTokens, {
      title,
      message: content,
      receiver: undefined,
      receiverEmail: undefined,
      receiverRole: "USER",
    });
  } catch (err: any) {
    console.error("❌ Error in sendNotification:", err.message || err);
  }
};
