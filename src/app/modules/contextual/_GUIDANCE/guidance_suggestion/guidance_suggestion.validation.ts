import { z } from "zod";
import { objectId } from "../../../../toolkit/helpers/zod.helper";

const createGuidanceSuggestion = z.object({
  body: z
    .object({
      suggestion: z.string().min(1, "suggestion is required"),
      tips: z.array(z.string().min(1)).min(1, "at least one tip is required"),
      suggestedScript: z.string().min(1, "suggestedScript is required"),
      category: objectId,
      scenario: z.string().min(1, "at least one scenario is required"),
    })
    .strict(),
});

const updateGuidanceSuggestion = z.object({
  body: z
    .object({
      suggestion: z.string().min(1, "suggestion is required").optional(),
      tips: z
        .array(z.string().min(1))
        .min(1, "at least one tip is required")
        .optional(),
      suggestedScript: z
        .string()
        .min(1, "suggestedScript is required")
        .optional(),
      category: objectId.optional(),
      scenario: z.string().optional(),
    })
    .strict(),
});

export const guidanceSuggestion_validation = {
  createGuidanceSuggestion,
  updateGuidanceSuggestion,
};
