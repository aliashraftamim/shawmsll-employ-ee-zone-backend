import { Schema } from "mongoose";
import {
  IAuth,
  ILocation,
  IPayment,
  IProfile,
  IRatings,
  IUserVerification,
} from "./user.helper.types";

export const UserVerificationSchema = new Schema<IUserVerification>(
  {
    verified: { type: Boolean, default: false },
    plans: { type: Schema.Types.ObjectId, ref: "Plan", default: null },
    plansType: { type: String, enum: ["basic", "advanced", ""], default: "" },
    otp: { type: String, default: "" },
  },
  { _id: false }
);

export const RatingsSchema = new Schema<IRatings>(
  {
    star: { type: Number, default: 0 },
    totalReview: { type: Number, default: 0 },
    totalUser: { type: Number, default: 0 },
  },
  { _id: false }
);

export const PaymentSchema = new Schema<IPayment>(
  {
    status: {
      type: String,
      enum: ["paid", "not-paid", "expired", "free"],
      default: "free",
    },
    isOneTime: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    issuedAt: { type: Date },
    deadline: { type: Number },
    deadlineType: {
      type: String,
      enum: ["day", "week", "month", "year"],
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
  },
  { _id: false }
);

export const LocationSchema = new Schema<ILocation>(
  {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
    name: { type: String },
  },
  { _id: false }
);

export const ProfileSchema = new Schema<IProfile>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, default: "" },
    phoneNumber: { type: String, required: true },
    companyName: { type: String, default: "" },
    bio: { type: String, default: "" },
    profileImage: { type: String, default: "" },
  },
  { _id: false }
);

export const AuthSchema = new Schema<IAuth>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String },
    agreeToTerms: { type: Boolean, required: true },
    passwordChangedAt: { type: Date },
  },
  { _id: false }
);
