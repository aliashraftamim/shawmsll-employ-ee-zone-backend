import z from "zod";

const createJobSearchTracker = z.object({
  body: z
    .object({
      jobTitle: z.string(),
      companyName: z.string(),
      date: z.string(),
      status: z.enum(["applied", "rejected", "interviewed"]),
    })
    .strict(),
});

const updateJobSearchTracker = z.object({
  body: z
    .object({
      jobTitle: z.string().optional(),
      companyName: z.string().optional(),
      date: z.string().optional(),

      status: z.enum(["applied", "rejected", "interviewed"]).optional(),
    })
    .strict(),
});

export const jobSearchTracker_validation = {
  createJobSearchTracker,
  updateJobSearchTracker,
};
