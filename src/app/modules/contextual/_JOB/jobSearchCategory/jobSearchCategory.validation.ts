import z from "zod";

const createJobSearchCategory = z.object({
  body: z
    .object({
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
      status: z.enum(["active", "inactive", "archived", "pending"]).optional(),
    })
    .strict(),
});

const updateJobSearchCategory = z.object({
  body: z
    .object({
      title: z.string().min(1, "Title is required").optional(),
      content: z.string().min(1, "Content is required").optional(),
      status: z.enum(["active", "inactive", "archived", "pending"]).optional(),
    })
    .strict(),
});

export const jobSearchCategoryValidation = {
  createJobSearchCategory,
  updateJobSearchCategory,
};
