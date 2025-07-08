/* eslint-disable no-unused-vars */
import { Model, ObjectId } from "mongoose";
import { USER_ROLE } from "../../../core/constants/global.constants";
import {
  IAuth,
  ILocation,
  IMessageResponse,
  IPayment,
  IProfile,
  IRatings,
  IUserVerification,
} from "./user.helper.types";

// Main IUser Interface
export interface IUser {
  _id?: ObjectId;

  profile: IProfile;
  auth: IAuth;
  location?: ILocation;
  payment?: IPayment;

  verification?: IUserVerification;
  msgResponse?: IMessageResponse;
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
