import z from "zod";

const createTags = z.object({
  body: z.object({ tag: z.string() }).strict(),
});

const updateTags = z.object({
  body: z
    .object({
      tag: z.string(),
    })
    .strict(),
});

export const tagsValidation = {
  createTags,
  updateTags,
};
