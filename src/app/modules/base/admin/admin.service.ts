/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import { CONFIG } from "../../../core/config";
import { USER_ROLE } from "../../../core/constants/global.constants";
import AppError from "../../../core/error/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const seedSuperAdmin = async () => {
  const superUser: IUser = {
    email: CONFIG.CORE.supper_admin_email!,
    password: CONFIG.CORE.supper_admin_pass!,
    confirmPassword: CONFIG.CORE.supper_admin_pass!,
    agreeToTerms: true,
    role: USER_ROLE.SUPPER_ADMIN,
    verification: {
      verified: true,
    },
    profile: {
      firstName: "Supper",
      lastName: "Admin",
      fullName: "Super Admin",
      phoneNumber: "01812345678",
      contactNumber: "01812345678",
      companyName: "Tech Innovators",
      bio: "Full-stack developer with a love for clean UI.",
      profileImage: "https://example.com/images/ali.jpg",
    },
    status: "active",
  };

  const isSuperAdminExits = await User.findOne({
    role: USER_ROLE.SUPPER_ADMIN,
  });

  if (!isSuperAdminExits) {
    return await User.create(superUser);
  }
  return null;
};

const getSupperAdmin = async () => {
  const admin: IUser | any = await User.findOne({
    role: USER_ROLE.SUPPER_ADMIN,
  });

  if (admin?.role === USER_ROLE.SUPPER_ADMIN) {
    return admin;
  }

  throw new AppError(httpStatus.NOT_FOUND, "Admin not found!");
};

export const adminService = {
  seedSuperAdmin,
  getSupperAdmin,
};
