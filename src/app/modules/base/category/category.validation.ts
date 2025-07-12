import { z } from "zod";

const createCategoryValidationSchema = z.object({
  file: z
    .object({
      fieldname: z.string().refine((val) => val === "image", {
        message: "Field name must be 'image'",
      }),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string().refine((val) => val.startsWith("image/"), {
        message: "Only image files are allowed",
      }),
      buffer: z.any(),
      size: z.number().positive().max(5000000),
    })
    .optional(),
  body: z.object({
    name: z.string().min(2).max(50),
    image: z.string().min(5).optional(),
    description: z.string().min(10).max(1000).optional(),
  }),
});

const updateCategoryValidationSchema = z.object({
  file: z
    .object({
      fieldname: z.string().refine((val) => val === "image", {
        message: "Field name must be 'image'",
      }),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string().refine((val) => val.startsWith("image/"), {
        message: "Only image files are allowed",
      }),
      buffer: z.any(),
      size: z.number().positive().max(5000000),
    })
    .optional(),
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    image: z.string().min(5).optional(),
    description: z.string().min(10).max(1000).optional(),
  }),
});

export const categoryValidator = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
