import z from "zod";

const createCommunicationToolkit = z.object({
  body: z
    .object({
      tone: z.array(z.string()).min(1, "At least one tone is required"),
      message: z.string().min(1, "Message is required"),
    })
    .strict(),
});

const updateCommunicationToolkit = z.object({
  body: z
    .object({
      tone: z
        .array(z.string())
        .min(1, "At least one tone is required")
        .optional(),
      message: z.string().min(1, "Message is required").optional(),
    })
    .strict(),
});

export const communicationToolkitValidation = {
  createCommunicationToolkit,
  updateCommunicationToolkit,
};
