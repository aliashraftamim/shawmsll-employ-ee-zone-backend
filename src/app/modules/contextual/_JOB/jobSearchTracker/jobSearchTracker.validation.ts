import z from "zod";

const createJobSearchTracker = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    status: z.enum(["active", "inactive", "archived", "pending"]).optional()  
  }).strict(),
});

const updateJobSearchTracker = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().min(1, "Content is required").optional(),
    status: z.enum(["active", "inactive", "archived", "pending"]).optional(),
  }).strict(),
});

export const jobSearchTracker_validation = {
  createJobSearchTracker,
  updateJobSearchTracker,
};
