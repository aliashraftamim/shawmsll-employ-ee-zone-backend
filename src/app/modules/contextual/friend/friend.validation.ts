import { z } from "zod";
import { objectId } from "../../../toolkit/helpers/zod.helper";

const createFriendValidation = z.object({
  body: z
    .object({
      friendId: objectId,
    })
    .strict(),
});

export const friend_validation = {
  createFriendValidation,
};
