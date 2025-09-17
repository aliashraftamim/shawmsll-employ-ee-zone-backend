/* eslint-disable no-console */
import { Worker } from "bullmq";
import { sendNotification } from "../../../modules/base/notification/notification.utils";
import { bullmq_connection } from "../queue";

new Worker(
  "notification-adds",
  async (job) => {
    const { fcmTokens, title, content } = job.data;
    console.log(
      `🐦‍🔥🐦‍🔥 BACKGROUND WORKER ~ notification-adds ~ job: ${(job.id, job.delay, title)}`
    );
    await sendNotification(fcmTokens, {
      title,
      message: content,
      receiver: undefined,
      receiverEmail: undefined,
      receiverRole: "USER",
    });
  },
  { connection: bullmq_connection }
);
