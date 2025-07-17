import { z } from "zod";

const createNoteHist = z.object({
  body: z
    .object({
      title: z.string().min(1, "Title is required"),
      body: z.string().min(1, "Body is required"),
      tag: z.array(z.string()).nonempty("At least one tag is required"),
      isDeleted: z.boolean().optional(),
    })
    .strict(),
});

export const note_history_validation = {
  createNoteHist,
};
