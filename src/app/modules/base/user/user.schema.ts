import { Schema } from "mongoose";

export const UserVerificationSchema = new Schema(
  {
    verified: { type: Boolean, default: false },
    plans: { type: Schema.Types.ObjectId, ref: "Plan" },
    plansType: { type: String, enum: ["basic", "advanced"] },
    otp: { type: String },
  },
  { _id: false }
);

export const RatingsSchema = new Schema(
  {
    star: { type: Number, default: 0 },
    totalReview: { type: Number, default: 0 },
    totalUser: { type: Number, default: 0 },
  },
  { _id: false }
);

export const MessageResponseSchema = new Schema(
  {
    isMyLastMessage: { type: Boolean, default: false },
  },
  { _id: false }
);

export const PaymentSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["paid", "not-paid", "expired", "free"],
      default: "free",
    },
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

export const LocationSchema = new Schema(
  {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
    name: { type: String },
  },
  { _id: false }
);

export const ProfileSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String },
    contactNumber: { type: String, required: true },
    companyName: { type: String },
    role: { type: String, required: true },
    bio: { type: String },
    profileImage: { type: String },
  },
  { _id: false }
);

export const AuthSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String },
    agreeToTerms: { type: Boolean, required: true },
    passwordChangedAt: { type: Date },
  },
  { _id: false }
);
