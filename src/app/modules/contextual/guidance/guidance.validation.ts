import { z } from "zod";
import { objectId } from "../../../common/helpers/zod.helper";

const createGuidance = z.object({
  body: z.object({ title: z.string(), category: objectId }).strict(),
});

const updateGuidance = z.object({
  body: z
    .object({
      category: z
        .string()
        .min(1, "Category ID is required")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
      scenario: z.string().min(1, "Scenario is required"),
      content: z.string().min(1, "Content is required"),
    })
    .strict(),
});

export const guidance_validation = {
  createGuidance,
  updateGuidance,
};
