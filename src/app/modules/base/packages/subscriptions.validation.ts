import { z } from "zod";

const FeatureSchema = z.object({
  title: z.string().optional(),
});

const createSubscriptionSchema = z.object({
  body: z
    .object({
      title: z.string(),
      description: z.string(),
      amount: z.number(),
      isOneTime: z.boolean(),
      features: z.array(FeatureSchema).optional(),
      services: z.array(z.string()).optional(),
      duration: z.number(),
      durationType: z.enum(["monthly", "free"]),
      type: z.enum(["basic", "premium", "advanced"]),
    })
    .strict(),
});

const updateSubscriptionSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      amount: z.number().optional(),
      isOneTime: z.boolean().optional(),
      features: z.array(FeatureSchema).optional(),
      duration: z.number(),
      durationType: z.enum(["monthly", "free"]),
      services: z.array(z.string()).optional(),
      type: z.enum(["basic", "premium", "advanced"]).optional(),
    })
    .strict(),
});

export const subscriptionsValidator = {
  createSubscriptionSchema,
  updateSubscriptionSchema,
};
