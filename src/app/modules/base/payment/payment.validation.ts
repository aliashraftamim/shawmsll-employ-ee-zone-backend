// import z from "zod";
// import { objectId } from "../../../common/helpers/zod.helper";

// export const PaymentStatusEnum = z.enum([
//   "paid",
//   "pending",
//   "expired",
//   "free",
//   "refunded",
//   "canceled",
// ]);

// const createPayment = z.object({
//   body: z
//     .object({
//       paymentId: z.string().min(1, "paymentId is required"),
//       sessionId: z.string().min(1, "sessionId is required"),
//       amount: z
//         .number({
//           invalid_type_error: "amount must be a number",
//         })
//         .nonnegative("amount cannot be negative"),
//       currency: z.string().min(1, "currency is required"),
//       status: PaymentStatusEnum,
//       subscriptionId: objectId,
//     })
//     .strict(),
// });

// const updatePayment = z.object({
//   body: z
//     .object({
//       title: z.string().min(1, "Title is required").optional(),
//       content: z.string().min(1, "Content is required").optional(),
//       status: z.enum(["active", "inactive", "archived", "pending"]).optional(),
//     })
//     .strict(),
// });

export const payment_validation = {};
