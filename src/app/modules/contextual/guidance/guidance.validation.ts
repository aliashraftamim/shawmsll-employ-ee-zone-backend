import { z } from "zod";
import { objectId } from "../../../common/helpers/zod.helper";

const createGuidance = z.object({
  body: z.object({ title: z.string(), category: objectId }).strict(),
});

export const guidance_validation = {
  createGuidance,
};
