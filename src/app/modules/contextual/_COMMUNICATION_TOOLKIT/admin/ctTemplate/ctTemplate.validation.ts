import z from "zod";

const createCtTemplate = z.object({
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
      size: z
        .number()
        .positive()
        .max(5000000, { message: "Image max length should be 5MB" }),
    })
    .optional(),
  body: z
    .object({
      title: z.string().min(1, "Title is required"),
      message: z.string().min(1, "Content is required"),
      tone: z.array(z.string()).min(1, "At least one tone is required"),
    })
    .strict(),
});

const updateCtTemplate = z.object({
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
      size: z
        .number()
        .positive()
        .max(5000000, { message: "Image max length should be 5MB" }),
    })
    .optional(),
  body: z
    .object({
      title: z.string().min(1, "Title is required").optional(),
      message: z.string().min(1, "Content is required").optional(),
      tone: z
        .array(z.string())
        .min(1, "At least one tone is required")
        .optional(),
    })
    .strict(),
});

export const ctTemplate_validation = {
  createCtTemplate,
  updateCtTemplate,
};
