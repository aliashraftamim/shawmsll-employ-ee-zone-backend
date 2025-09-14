/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../../core/error/AppError";
import { StripePaymentHandler } from "../../../toolkit/classes/stripe/stripe.paymentHandle";
import redis from "../../../toolkit/utils/redis/redis";
import { IPayment } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { User } from "../user/user.model";
import { ISubscription } from "./subscriptions.interface";
import { Subscription } from "./subscriptions.model";

const cacheKey = "subscriptions:active";
const getSubscriptionKey = (id: mongoose.Types.ObjectId) =>
  `subscription:${id.toString()}`;
const EXPIRE_TIME = 3600;

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
  subsId: mongoose.Types.ObjectId,
  vendorId: mongoose.Types.ObjectId
) => {
  if (!subsId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Service ID is required in params"
    );
  }

  const subscription: Partial<ISubscription | null> =
    await Subscription.findOne({
      _id: subsId,
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
    userId: user._id,

    paymentId: "",
    sessionId: "",
    amount: user.payment.amount,
    currency: currency || "usd",
    status: "pending",
    subscriptionId: subsId,
  };

  await Payment.create(paymentPayload);

  const paymentHandler = new StripePaymentHandler();

  return await paymentHandler.paySubscription({
    lineItems: [
      {
        name: subscription?.title || "Subscription",
        amount: Number(amount),
        quantity: 1,
      },
    ],
    customerEmail: user.email,
    userId: user._id.toString(),
  });

  // return await subscription_payment.createStripeSubscriptionSession(
  //   amount,
  //   {
  //     id: vendorId as any,
  //     subscriptionID: subsId as any,
  //     deadline: subscription.duration.count,
  //     deadlineType: subscription.duration.durationType,
  //     issuedAt: new Date(),
  //     email: user.email,
  //     name: user.name,
  //   },
  //   currency || "usd"
  // );
};

const paymentSuccessStripe = async (payload: any) => {
  if (!payload.session_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "session_id is required");
  }

  const paymentHandler = new StripePaymentHandler();
  const successSession = paymentHandler.subscriptionSuccess(payload);

  return successSession;
};

const paymentCancelStripe = async (payload: any) => {
  const stripeHandler = new StripePaymentHandler();
  return await stripeHandler.cancelSubscription(payload);
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
