/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { Server } from "socket.io";
import AppError from "../app/core/error/AppError";
import { User } from "../app/modules/base/user/user.model";
import { getUserFromToken } from "../app/toolkit/utils/getUserFromToken";

const setUserOnline = async (
  token: string,
  io: Server
): Promise<JwtPayload | null> => {
  try {
    const user = await getUserFromToken(token);
    if (user) {
      await User.findByIdAndUpdate(user._id, { isOnline: true });
      return user;
    }
    return null;
  } catch (error: any) {
    console.error("🚀 userStatusHandler setUserOnline error:", error);
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
    io.emit("io-error", {
      success: false,
      message: error.message || "unknown error",
    });
    return null;
  }
};

const setUserOffline = async (userId: string) => {
  try {
    await User.findByIdAndUpdate(userId, { isOnline: false });
  } catch (error) {
    console.error("🚀 userStatusHandler setUserOffline error:", error);
  }
};

export default {
  setUserOnline,
  setUserOffline,
};
