/* eslint-disable no-console */
import cron from "node-cron";
import { notificationServices } from "../../../modules/base/notification/notification.service";
export const cron_jobs = async () => {
  console.info("➿ Cron jobs running at 00:00 every day.....");
  cron.schedule("0 0 * * *", async () => {
    await notificationServices.deleteOldNotifications();
  });
};
