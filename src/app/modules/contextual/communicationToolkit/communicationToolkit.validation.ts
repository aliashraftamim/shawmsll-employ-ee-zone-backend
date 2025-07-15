import { z } from "zod";

// ✅ Create Communication Toolkit Schema
const createCommunicationToolkit = z.object({
  body: z
    .object({
      icon: z.string().trim().optional(),
      title: z.string().trim().min(1, "Title is required"),
      tone: z
        .array(z.string().min(1, "Each tone must be a non-empty string"))
        .min(1, "At least one tone is required"),
      message: z.string().trim().optional(),
    })
    .strict(),
});

// ✅ Update Communication Toolkit Schema (optional fields)
const updateCommunicationToolkit = z.object({
  body: z
    .object({
      icon: z.string().trim().min(1).optional(),
      title: z.string().trim().min(1).optional(),
      tone: z.array(z.string().min(1)).optional(),
      message: z.string().trim().min(1).optional(),
    })
    .strict(),
});

export const communicationToolkit_validation = {
  createCommunicationToolkit,
  updateCommunicationToolkit,
};
