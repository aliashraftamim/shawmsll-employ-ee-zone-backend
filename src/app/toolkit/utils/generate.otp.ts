import httpStatus from "http-status";
import AppError from "../../core/error/AppError";

export const generateOTP = (otpLength: number): number => {
  if (!otpLength) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP length");
  }

  const min = Math.pow(10, otpLength - 1);
  const max = Math.pow(10, otpLength) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
