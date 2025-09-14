/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { Server } from "socket.io";
import { User } from "../app/modules/base/user/user.model";
import { getUserFromToken } from "../app/toolkit/utils/getUserFromToken";

const setUserOnline = async (
  token: string,
  io: Server
): Promise<JwtPayload | null> => {
  try {
    const user = await getUserFromToken(token);

    if (!user) {
      // JWT expired or invalid
      io.emit("io-error", {
        success: false,
        message: "JWT expired or invalid. Please login again.",
      });
      return null;
    }

    // mark user online
    await User.findByIdAndUpdate(user._id, { isOnline: true });

    // Optional: broadcast online status to other users
    io.emit("user-online", { userId: user._id, online: true });

    return user;
  } catch (error: any) {
    console.error("🚀 userStatusHandler setUserOnline error:", error);

    io.emit("io-error", {
      success: false,
      message: error.message || "Unknown server error",
    });

    return null;
  }
};

const setUserOffline = async (userId: string, io?: Server) => {
  try {
    await User.findByIdAndUpdate(userId, { isOnline: false });

    // Optional: broadcast offline status
    if (io) {
      io.emit("user-offline", { userId, online: false });
    }
  } catch (error: any) {
    console.error("🚀 userStatusHandler setUserOffline error:", error);
    if (io) {
      io.emit("io-error", {
        success: false,
        message: error.message || "Unknown server error",
      });
    }
  }
};

export default {
  setUserOnline,
  setUserOffline,
};

// /* eslint-disable no-console */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { JwtPayload } from "jsonwebtoken";
// import { Server } from "socket.io";
// import { User } from "../app/modules/base/user/user.model";
// import { getUserFromToken } from "../app/toolkit/utils/getUserFromToken";

// const setUserOnline = async (
//   token: string,
//   io: Server
// ): Promise<JwtPayload | null> => {
//   try {
//     const user = await getUserFromToken(token);
//     if (user) {
//       await User.findByIdAndUpdate(user._id, { isOnline: true });
//       return user;
//     }
//     return null;
//   } catch (error: any) {
//     console.error("🚀 userStatusHandler setUserOnline error:", error);
//     // throw new AppError(httpStatus.BAD_REQUEST, error.message);
//     io.emit("io-error", {
//       success: false,
//       message: error.message || "unknown error",
//     });
//     return null;
//   }
// };

// const setUserOffline = async (userId: string) => {
//   try {
//     await User.findByIdAndUpdate(userId, { isOnline: false });
//   } catch (error) {
//     console.error("🚀 userStatusHandler setUserOffline error:", error);
//   }
// };

// export default {
//   setUserOnline,
//   setUserOffline,
// };
