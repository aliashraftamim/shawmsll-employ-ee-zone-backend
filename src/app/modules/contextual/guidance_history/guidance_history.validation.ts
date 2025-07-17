import { z } from "zod";
import { objectId } from "../../../common/helpers/zod.helper";

const createGuidanceHistory = z.object({
  body: z
    .object({
      category: objectId,
      guidance: z.string().min(1, "Guidance is required"),
      tips: z.array(z.string()),
    })
    .strict(),
});

const updateGuidanceHistory = z.object({
  body: z
    .object({
      category: objectId,
      guidance: z.string().min(1, "Guidance is required"),
      tips: z.array(z.string()),
    })
    .strict(),
});

export const guidance_history_validation = {
  createGuidanceHistory,
  updateGuidanceHistory,
};
