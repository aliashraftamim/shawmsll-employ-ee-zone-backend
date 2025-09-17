/* eslint-disable no-console */
import { Worker } from "bullmq";
import { TopUsedTools } from "../../../modules/contextual/top-used-tools/top-used-tools.model";
import { CONFIG } from "../../config";

export const toolWorker = new Worker(
  "tool-usage",
  async (job) => {
    console.log(`🔥 Job received for ${job.data.title}`);
    const { title } = job.data;
    const tool = await TopUsedTools.findOne({ title });
    if (tool) {
      await TopUsedTools.findByIdAndUpdate(tool._id, { $inc: { priority: 1 } });
      console.log(`✅ Priority updated for ${title}`);
    }
  },
  {
    connection: {
      host: CONFIG.CORE.bullmq_host,
      port: Number(CONFIG.CORE.redis_port),
    },
  }
);
