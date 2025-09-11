/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import redis from "../../../common/utils/redis/redis";
import AppError from "../../../core/error/AppError";
import { IPayment } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { User } from "../user/user.model";
import { stripe, subscription_payment } from "./subscription.payment";
import { ISubscription } from "./subscriptions.interface";
import { Subscription } from "./subscriptions.model";

const cacheKey = "subscriptions:active";
const getSubscriptionKey = (id: mongoose.Types.ObjectId) =>
  `subscription:${id.toString()}`;
const EXPIRE_TIME = 3600; // 1 hour

const createSubscription = async (payload: ISubscription) => {
  if (payload.isOneTime) {
    payload.durationType = "oneTime";
  }

  const result = await Subscription.create(payload);

  // Cache single item
  await redis.setWithExpiry(
    getSubscriptionKey(result._id),
    JSON.stringify(result),
    EXPIRE_TIME
  );

  // Invalidate the list cache
  await redis.del(cacheKey);

  return result;
};

const updateSubscription = async (
  subId: mongoose.Types.ObjectId,
  payload: ISubscription
) => {
  const result = await Subscription.findByIdAndUpdate(subId, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found!");
  }

  // Update individual cache and invalidate list
  await redis.del(cacheKey);
  await redis.setWithExpiry(
    getSubscriptionKey(subId),
    JSON.stringify(result),
    EXPIRE_TIME
  );

  return result;
};

const getSubscription = async () => {
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const result = await Subscription.find({
    isDeleted: false,
    status: "active",
  });

  await redis.setWithExpiry(cacheKey, JSON.stringify(result), EXPIRE_TIME);

  return result;
};

const getSubscriptionById = async (subId: mongoose.Types.ObjectId) => {
  return await Subscription.findOne({ _id: subId, isDeleted: false });
};

const deleteSubscription = async (subId: mongoose.Types.ObjectId) => {
  const hunt = await Subscription.findOne({
    _id: subId,
    isDeleted: false,
  });

  if (!hunt) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Subscription is not found in database!"
    );
  }

  const result = await Subscription.findByIdAndUpdate(
    subId,
    { isDeleted: true }, // ✅ Fixed field name
    { new: true }
  );

  // Invalidate caches
  await redis.del(cacheKey);
  await redis.del(getSubscriptionKey(subId));

  return result;
};

const paymentASubscription = async (
  serviceId: mongoose.Types.ObjectId,
  vendorId: mongoose.Types.ObjectId
) => {
  if (!serviceId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Service ID is required in params"
    );
  }

  const subscription: ISubscription | any = await Subscription.findOne({
    _id: serviceId,
    status: "active",
  });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  const { currency, amount } = subscription;
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  await User.isUserExistById(vendorId);

  const user: any = await User.findById(vendorId);

  // if (user.payment.status === "paid") {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User already paid");
  // }

  const paymentPayload: IPayment = {
    paymentId: "",
    sessionId: "",
    amount: user.payment.amount,
    currency: currency || "usd",
    status: "pending",
    subscriptionId: serviceId,
  };

  const createPayment = await Payment.create(paymentPayload);
  console.log("🚀 ~ paymentASubscription ~ createPayment:", createPayment);

  return await subscription_payment.createStripeSubscriptionSession(
    amount,
    {
      id: vendorId as any,
      subscriptionID: serviceId as any,
      deadline: subscription.duration.count,
      deadlineType: subscription.duration.durationType,
      issuedAt: new Date(),
      email: user.email,
      name: user.name,
    },
    currency || "usd"
  );
};

const paymentSuccessStripe = async (payload: any) => {
  if (!payload.session_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "session_id is required");
  }

  const session = await stripe.checkout.sessions.retrieve(payload.session_id, {
    expand: ["line_items", "customer"],
  });

  const subscriptionID = session.metadata?.subscriptionID || null;

  if (session.client_reference_id) {
    const userId = session.client_reference_id as string;
    const deadline = Number(session.metadata!.deadline);

    const user = await User.isUserExistById(userId as any);

    if (user?.payment?.status === "paid") {
      throw new AppError(httpStatus.BAD_REQUEST, "User is already paid");
    }

    await User.findByIdAndUpdate(userId, {
      $set: {
        "payment.status": "paid",
        "payment.amount": session?.amount_total
          ? session.amount_total / 100
          : 0,
        "payment.deadline": deadline || 0,
        "payment.deadlineType": session.metadata!.deadlineType || null,
        "payment.issuedAt": session.metadata!.issuedAt || new Date(),
        "payment.subscription": subscriptionID,
      },
    });
  }

  return session;
};

const paymentCancelStripe = async (payload: any) => {
  if (!payload.session_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "session_id is required");
  }

  const session = await stripe.checkout.sessions.retrieve(payload.session_id, {
    expand: ["line_items", "customer"],
  });

  const subscriptionID = session.metadata?.subscriptionID || null;

  if (session.client_reference_id) {
    const userId = session.client_reference_id as string;
    const deadline = Number(session.metadata!.deadline);

    const user = await User.isUserExistById(userId as any);

    if (user?.payment?.status === "paid") {
      throw new AppError(httpStatus.BAD_REQUEST, "User is already paid");
    }

    await User.findByIdAndUpdate(userId, {
      $set: {
        "payment.status": "paid",
        "payment.amount": session.amount_total ?? 0,
        "payment.deadline": deadline || 0,
        "payment.deadlineType": session.metadata!.deadlineType || null,
        "payment.issuedAt": session.metadata!.issuedAt || new Date(),
        "payment.subscription": subscriptionID,
      },
    });
  }

  return session;
};

export const subscriptionsService = {
  createSubscription,
  updateSubscription,
  getSubscription,
  getSubscriptionById,
  deleteSubscription,
  paymentASubscription,
  paymentSuccessStripe,
  paymentCancelStripe,
};
