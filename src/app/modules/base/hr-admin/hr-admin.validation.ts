import z from "zod";
import { CONFIG } from "../../../core/config";

const availableTimeSchema = z.object({
  startDay: z.string().optional(),
  endDay: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

const createHrAdmin = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email address"),
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      qualification: z.string(),
      phoneNumber: z.string(),
      password: z.string().min(Number(CONFIG.CORE.password_length)),
      expertise: z.array(z.string()),
      availableTime: availableTimeSchema,
      description: z.string(),
      howHelp: z.array(z.string()),
    })
    .strict(),
});

const updateHrAdmin = z.object({
  body: z
    .object({
      expertise: z.array(z.string()).optional(),
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      qualification: z.string().optional(),
      phoneNumber: z.string().optional(),
      bio: z.string().optional(),
      availableTime: availableTimeSchema.optional(),
      description: z.string().optional(),
      howHelp: z.array(z.string()).optional(),
    })
    .strict(),
});

export const hrAdmin_validation = {
  createHrAdmin,
  updateHrAdmin,
};
