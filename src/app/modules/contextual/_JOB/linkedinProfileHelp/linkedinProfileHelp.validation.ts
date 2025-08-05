import z from "zod";

const createLinkedinProfileHelp = z.object({
  body: z
    .object({
      name: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
    })
    .strict(),
});

const updateLinkedinProfileHelp = z.object({
  body: z
    .object({
      name: z.string().min(1, "Title is required").optional(),
      content: z.string().min(1, "Content is required").optional(),
    })
    .strict(),
});

export const linkedinProfileHelp_validation = {
  createLinkedinProfileHelp,
  updateLinkedinProfileHelp,
};
