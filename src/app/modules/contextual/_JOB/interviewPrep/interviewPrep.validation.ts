import z from "zod";

const createInterviewPrep = z.object({
  body: z
    .object({
      name: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
    })
    .strict(),
});

const updateInterviewPrep = z.object({
  body: z
    .object({
      name: z.string().min(1, "Title is required").optional(),
      content: z.string().min(1, "Content is required").optional(),
    })
    .strict(),
});

export const interviewPrep_validation = {
  createInterviewPrep,
  updateInterviewPrep,
};
