import z from "zod";

const createPolicyRights = z.object({
  // file: z.object({
  //   fieldname: z.string().refine((val) => val === "image", {
  //     message: "Field name must be 'image'",
  //   }),
  //   originalname: z.string(),
  //   encoding: z.string(),
  //   mimetype: z.string().refine((val) => val.startsWith("image/"), {
  //     message: "Only image files are allowed",
  //   }),
  //   buffer: z.any(),
  //   size: z
  //     .number()
  //     .positive()
  //     .max(5000000, { message: "Image max length should be 5MB" }),
  // }),
  body: z
    .object({
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
    })
    .strict(),
});

const updatePolicyRights = z.object({
  body: z
    .object({
      title: z.string().min(1, "Title is required").optional(),
      content: z.string().min(1, "Content is required").optional(),
    })
    .strict(),
});

export const PolicyRightsValidation = {
  createPolicyRights,
  updatePolicyRights,
};
