import { z } from "zod";

// ✅ Create validation
const createWorkplaceJournal = z.object({
  body: z
    .object({
      title: z.string().trim().min(1, "Title is required"),
      note: z.string().trim().min(1, "Note is required"),
      tags: z.array(z.string()),
    })
    .strict(),
});

// ✅ Update validation (all optional fields)
const updateWorkplaceJournal = z.object({
  body: z
    .object({
      title: z.string().trim().min(1, "Title cannot be empty").optional(),
      note: z.string().trim().min(1, "Note cannot be empty").optional(),
      tags: z.array(z.string()).optional(),
    })
    .strict(),
});

export const workPlaceJournal_validation = {
  createWorkplaceJournal,
  updateWorkplaceJournal,
};
