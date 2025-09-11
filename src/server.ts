/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import chalk from "chalk";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { CONFIG } from "./app/core/config";

import { defaultJob } from "./app/common/helpers/DEFAULT_JOBS/main";
import { sendNotification } from "./app/modules/base/notification/notification.utils";
import { server as socketServer } from "./socket/socket.server";

let server: Server;
// ✅ Handle uncaught exceptions (e.g., synchronous errors)
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception detected. Shutting down...");
  console.error(err);
  process.exit(1);
});

// ✅ Main function to connect DB and start servers
async function main() {
  try {
    // await initializeApolloServer(app);

    // Connect to MongoDB
    await mongoose.connect(CONFIG.CORE.db_uri as string);
    console.info(chalk.blueBright("📦 Connected to MongoDB"));

    // Start the Express application server
    server = app.listen(
      Number(CONFIG.CORE.port),
      CONFIG.CORE.ip ?? "localhost",
      () => {
        console.info(
          chalk.bgBlackBright(
            `✅ Server is listening on http://${CONFIG.CORE.ip ?? "localhost"}:${CONFIG.CORE.port} `
          )
        );
      }
    );

    await sendNotification(
      [
        "f_brBuy4Szqo5HXyVortEu:APA91bGzD2MpPMp1ezf-MNGAW-5d6DQX5X0RZQ9ra8XS0bwMtYnGI5lGulXwep4YWLD65wZffQJ_l1qw1y6TtKeqvPuPhOcHbG_LVV01HBvmNxehqppaWcE",
      ],
      {
        title: "Server is up and running",
        message: `Server is listening on http://${CONFIG.CORE.ip ?? "localhost"}:${CONFIG.CORE.port} `,
        receiverRole: "admin",
        receiverEmail: "mehidihasan01201@gmail.com",
        receiver: new mongoose.Types.ObjectId("68bbfc7d922c4bfd9abd95f2"),
      }
    );

    // * Default data creation
    await defaultJob();

    // Start the Socket.IO server
    socketServer.listen(
      {
        port: CONFIG.CORE.socket_port,
        host: CONFIG.CORE.ip,
      },
      () => {
        console.info(
          chalk.bgYellowBright(
            `🗨️  Socket is running at http://${CONFIG.CORE.ip ?? "localhost"}:${CONFIG.CORE.socket_port}`
          )
        );
      }
    );
  } catch (err) {
    console.error("❌ Failed to start the server.");
    console.error(err);
    process.exit(1);
  }
}

// ✅ Handle unhandled promise rejections (e.g., async errors)
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection detected. Shutting down...");
  console.error(err);

  if (server) {
    // Gracefully close the server before exiting
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// ✅ Start the main application
main();
