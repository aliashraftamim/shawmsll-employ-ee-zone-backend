import z from "zod";
import { objectId } from "../../../common/helpers/zod.helper";

const createBookmark = z.object({
  body: z
    .object({
      type: z.string({ required_error: "Type is required" }),
      itemTitle: z.string({ required_error: "Item title is required" }),
      itemId: objectId,
      content: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .strict(),
});

const updateBookmark = z.object({
  body: z
    .object({
      type: z.string({ required_error: "Type is required" }).optional(),
      itemTitle: z
        .string({ required_error: "Item title is required" })
        .optional(),
      content: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .strict(),
});

export const bookmark_validation = {
  createBookmark,
  updateBookmark,
};
