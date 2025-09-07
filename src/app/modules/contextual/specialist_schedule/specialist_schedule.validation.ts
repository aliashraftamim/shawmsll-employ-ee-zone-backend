import { z } from "zod";

// Date validation: YYYY-MM-DD
const validDate = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date format",
});

// Time validation: HH:MM AM/PM (12-hour)
const validTime = z
  .string()
  .regex(/^(0?[1-9]|1[0-2]):([0-5]\d) ?([APap][Mm])$/, "Invalid time format");

// Create specialist schedule
const createSpecialistSchedule = z.object({
  body: z
    .object({
      specialist: z.string(),
      date: validDate,
      time: validTime,
    })
    .strict(),
});

// Update specialist schedule
const updateSpecialistSchedule = z.object({
  body: z
    .object({
      date: validDate.optional(),
      time: validTime.optional(),
    })
    .strict(),
});

export const specialistSchedule_validation = {
  createSpecialistSchedule,
  updateSpecialistSchedule,
};
