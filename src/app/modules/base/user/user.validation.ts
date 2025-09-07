import { z } from "zod";
import { CONFIG } from "../../../core/config";

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  userName: z.string().optional(),
  phoneNumber: z.string().min(6),
  contactNumber: z.string().min(6),
  companyName: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.string().url().optional(),
});

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  userName: z.string().optional(),
  phoneNumber: z.string().min(6).optional(),
  companyName: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.string().url().optional(),
});

const createUserValidationSchema = z.object({
  body: z
    .object({
      profile: profileSchema,
      email: z.string().email(),
      password: z.string().min(Number(CONFIG.CORE.password_length)),
      confirmPassword: z
        .string()
        .min(Number(CONFIG.CORE.password_length))
        .optional(),
      agreeToTerms: z.boolean().refine((v) => v === true, {
        message: "You must agree to the terms",
      }),
    })
    .strict(),
});
const updateUserValidationSchema = z.object({
  file: z
    .object({
      fieldname: z.string().refine((val) => val === "profileImage", {
        message: "Field name must be 'profileImage'",
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
  body: z
    .object({
      profile: updateProfileSchema.optional(),
    })
    .strict(),
});

export const userValidator = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
