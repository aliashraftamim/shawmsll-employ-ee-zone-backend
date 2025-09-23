import z from "zod";

const createContentForAdds = z.object({
  body: z
    .object({
      contentType: z.string(),
      image: z.string().url().nullable().optional(),
      content: z.string(),
      date: z.string().nullable().optional(),
      time: z.string().nullable().optional(),
      isSent: z.boolean().optional(),
      targetUsers: z.object({
        allUser: z.boolean(),
        freePlanUser: z.boolean(),
        premiumUser: z.boolean(),
      }),
    })
    .strict(),
});

const updateContentForAdds = z.object({
  body: z
    .object({
      contentType: z.string().optional(),
      image: z.string().url().nullable().optional(),
      content: z.string().optional(),
      date: z.string().nullable().optional(),
      time: z.string().nullable().optional(),
      isSent: z.boolean().optional(),
      targetUsers: z
        .object({
          allUser: z.boolean().optional(),
          freePlanUser: z.boolean().optional(),
          premiumUser: z.boolean().optional(),
        })
        .optional(),
    })
    .strict(),
});

export const contentForAdds_validation = {
  createContentForAdds,
  updateContentForAdds,
};
