import z from "zod";

const createScheduleType = z.object({
  body: z
    .object({
      name: z.string().min(1, "Name is required"),
    })
    .strict(),
});

const updateScheduleType = z.object({
  body: z
    .object({
      name: z.string().min(1, "Name is required").optional(),
    })
    .strict(),
});

export const scheduleType_validation = {
  createScheduleType,
  updateScheduleType,
};
