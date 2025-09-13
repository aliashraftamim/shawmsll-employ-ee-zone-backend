import { z } from "zod";
import { objectId } from "../../../../toolkit/helpers/zod.helper";

const createGuidance = z.object({
  body: z
    .object({
      category: objectId,
      scenario: z.string().min(1, "Scenario is required"),
      content: z.string().min(1, "Content is required"),
      tips: z.array(z.string()),
    })
    .strict(),
});

const updateGuidance = z.object({
  body: z
    .object({
      category: objectId.optional(),
      scenario: z.string().min(1, "Scenario is required").optional(),
      content: z.string().min(1, "Content is required").optional(),
      tips: z.array(z.string()).optional(),
    })
    .strict(),
});

export const guidance_validation = {
  createGuidance,
  updateGuidance,
};
