import { z } from "zod";

const createWorkplaceJournal = z.object({
  body: z
    .object({
      title: z.string().trim().min(1, "Title is required"),
      note: z.string().min(1, "Note is required"),
      tags: z.array(z.string()),
    })
    .strict(),
});

export const workPlaceJournal_validation = {
  createWorkplaceJournal,
};
