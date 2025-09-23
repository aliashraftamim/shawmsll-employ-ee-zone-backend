import { z } from "zod";
import { objectId } from "../../../../toolkit/helpers/zod.helper";

const createGuidance = z.object({
  body: z
    .object({
      category: objectId,
      scenario: z.string().min(1, "Scenario is required"),
      guidance: z.string().min(1, "guidance is required"),
      suggestedScript: z.string().min(1, "Suggested Script is required"),
      tips: z.array(z.string()),
    })
    .strict(),
});

const updateGuidance = z.object({
  body: z
    .object({
      suggestedScript: z.string().min(1, "Suggested Script is required"),
    })
    .strict(),
});

export const guidance_validation = {
  createGuidance,
  updateGuidance,
};
