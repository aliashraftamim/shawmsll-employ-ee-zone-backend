import { z } from "zod";
import { CONFIG } from "../../../core/config";

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fullName: z.string().min(1),
  userName: z.string().optional(),
  phoneNumber: z.string().min(6),
  contactNumber: z.string().min(6),
  companyName: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.string().url().optional(),
});

const authSchema = z.object({});

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
      passwordChangedAt: z.date().optional(),
    })
    .strict(),
});

export const userValidator = {
  createUserValidationSchema,
  // updateUserValidationSchema,
};
