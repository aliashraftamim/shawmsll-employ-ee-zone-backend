import { CONFIG } from "../config";

import { Queue } from "bullmq";

export const bullmq_connection = {
  host: CONFIG.CORE.bullmq_host,
  port: Number(CONFIG.CORE.redis_port),
};

// 1️⃣ Tool Usage Queue
export const toolQueue = new Queue("tool-usage", {
  connection: bullmq_connection,
});

// 2️⃣ Notification Adds Queue
export const notificationAddsQueue = new Queue("notification-adds", {
  connection: bullmq_connection,
});
