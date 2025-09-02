import z from "zod";
import { CONFIG } from "../../../core/config";

const createHrAdmin = z.object({
  // file: z.object({
  //   fieldname: z.string().refine((val) => val === "profileImage", {
  //     message: "Field name must be 'profileImage'",
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
      email: z.string().email("Invalid email address"),
      password: z.string().min(Number(CONFIG.CORE.password_length)),
      expertise: z.array(z.string()),
      availableTime: z.array(
        z.object({
          date: z.string(),
          startTime: z.string(),
          endTime: z.string(),
        })
      ),
      description: z.string(),
    })
    .strict(),
});

const updateHrAdmin = z.object({
  body: z
    .object({
      expertise: z.array(z.string()).optional(),
      availableTime: z
        .array(
          z.object({
            date: z.string().optional(),
            startTime: z.string().optional(),
            endTime: z.string().optional(),
          })
        )
        .optional(),
      description: z.string().optional(),
    })
    .strict(),
});

export const hrAdmin_validation = {
  createHrAdmin,
  updateHrAdmin,
};
