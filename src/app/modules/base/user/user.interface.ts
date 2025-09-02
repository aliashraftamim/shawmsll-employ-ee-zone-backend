/* eslint-disable no-unused-vars */
import { Model, ObjectId } from "mongoose";
import { USER_ROLE } from "../../../core/constants/global.constants";
import {
  ILocation,
  IPayment,
  IProfile,
  IRatings,
  IUserVerification,
} from "./user.helper.types";

// Main IUser Interface
export interface IUser {
  _id?: ObjectId;

  email: string;
  password: string;
  confirmPassword?: string;
  agreeToTerms: boolean;
  passwordChangedAt?: Date;
  role: keyof typeof USER_ROLE;

  profile: IProfile;
  location?: ILocation;
  payment?: IPayment;

  verification: IUserVerification;
  isMyLastMessage?: boolean;
  ratings?: IRatings;

  fcmToken?: string;
  isOnline?: boolean;
  isDeleted?: boolean;
  status?: "active" | "blocked" | "pending";
}

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<IUser> {
  isUserExistById(id: ObjectId, fields?: string): Promise<IUser>;
  isUserExistByEmail(email: string, fields?: string): Promise<IUser>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
