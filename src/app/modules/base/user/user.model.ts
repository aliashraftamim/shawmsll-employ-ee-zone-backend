/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { model, Schema } from "mongoose";

import { CONFIG } from "../../../core/config";
import { USER_ROLE } from "../../../core/constants/global.constants";
import AppError from "../../../core/error/AppError";
import { IUser, UserModel } from "./user.interface";
import {
  LocationSchema,
  PaymentSchema,
  ProfileSchema,
  RatingsSchema,
  UserVerificationSchema,
} from "./user.schema";

// Main User Schema
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: "USER",
    },

    profile: { type: ProfileSchema },
    location: { type: LocationSchema, required: false },
    payment: {
      type: PaymentSchema,
      required: false,
      default: () => ({
        status: "free",
        isOneTime: false,
        amount: 0,
        issuedAt: null,
        deadline: 0,
        deadlineType: "month",
        subscription: null,
      }),
    },

    verification: {
      type: UserVerificationSchema,
      default: () => ({
        verified: false,
        plansType: "",
        otp: "",
      }),
    },
    isMyLastMessage: {
      type: Boolean,
      default: false,
    },

    ratings: { type: RatingsSchema },
    agreeToTerms: { type: Boolean, required: true },
    passwordChangedAt: { type: Date },

    fcmToken: { type: String },
    isOnline: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Indexing location for geo queries
UserSchema.index({ "location.coordinates": "2dsphere" });

UserSchema.pre("save", async function () {
  // const isVerifiedEmail = await isEmailVerified(this?.email);
  if (!this.isModified("password")) {
    return;
  }

  // Validate that passwords match
  if (this.password !== this.confirmPassword) {
    throw new AppError(
      httpStatus.UNPROCESSABLE_ENTITY,
      "Passwords don't match"
    );
  }

  // Hash the password
  this.password = await bcrypt.hash(
    this.password,
    Number(CONFIG.BCRYPT.bcrypt_salt_rounds)
  );

  // Remove the confirmPassword field
  this.confirmPassword = undefined;
});

UserSchema.statics.isUserExistById = async function (id: string) {
  try {
    const user = await User.findById(id);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found2!");
    }

    if (!user?.verification?.verified) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not verified! Please verify your email"
      );
    }

    // Check if the user is deleted
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
    }

    // Check if the user is blocked
    if (user?.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
    }
    return user || null;
  } catch (error: any) {
    console.error("Error checking user existence:", error.message);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Error checking user existence"
    );
  }
};

UserSchema.statics.isUserExistByEmail = async function (email: string) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
    }

    if (!user?.verification?.verified) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not verified! Please verify your email"
      );
    }

    // Check if the user is deleted
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User was deleted!");
    }

    // Check if the user is blocked
    if (user?.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "User was blocked!");
    }
    return user || null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error checking user existence:", error.message);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Error checking user existence"
    );
  }
};

UserSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, UserModel>("User", UserSchema);
