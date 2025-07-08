import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fullName: z.string().min(1),
  userName: z.string().optional(),
  phoneNumber: z.string().min(6),
  contactNumber: z.string().min(6),
  companyName: z.string().optional(),
  role: z.string().min(1),
  bio: z.string().optional(),
  profileImage: z.string().url().optional(),
});

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6).optional(),
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: "You must agree to the terms",
  }),
  passwordChangedAt: z.date().optional(),
});

const createUserValidationSchema = z.object({
  body: z
    .object({
      profile: profileSchema,
      auth: authSchema,
    })
    .strict(),
});

export const userValidator = {
  createUserValidationSchema,
  // updateUserValidationSchema,
};
