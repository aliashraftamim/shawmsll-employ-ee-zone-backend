import { z } from "zod";

const policyRightsCreateSchema = z.object({
  body: z.union([
    // Federal Law category
    z
      .object({
        title: z.string(),
        category: z.literal("federal-law"),
        federalLaw: z.object({
          policyLaw: z.string(),
          content: z.string(),
        }),
        isDeleted: z.boolean().optional(),
      })
      .strict(),

    // State category
    z
      .object({
        title: z.string(),
        category: z.literal("state"),
        state: z.object({
          stateName: z.string(),
          stateTitle: z.string(),
        }),
        isDeleted: z.boolean().optional(),
      })
      .strict(),
  ]),
});

// Update schema - সব field optional
const policyRightsUpdateSchema = z.object({
  body: z.union([
    // Federal Law category - partial
    z
      .object({
        title: z.string().optional(),
        category: z.literal("federal-law").optional(),
        federalLaw: z
          .object({
            policyLaw: z.string().optional(),
            content: z.string().optional(),
          })
          .optional(),
        isDeleted: z.boolean().optional(),
      })
      .strict(),

    // State category - partial
    z
      .object({
        title: z.string().optional(),
        category: z.literal("state").optional(),
        state: z
          .object({
            stateName: z.string().optional(),
            stateTitle: z.string().optional(),
          })
          .optional(),
        isDeleted: z.boolean().optional(),
      })
      .strict(),
  ]),
});

export const PolicyRightsValidation = {
  policyRightsCreateSchema,
  policyRightsUpdateSchema,
};
