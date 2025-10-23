/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import nodemailer from "nodemailer";
import { CONFIG } from "../../../core/config";

export const transporter = nodemailer.createTransport({
  host: CONFIG.MAIL.smtp_host,
  port: Number(CONFIG.MAIL.smtp_port),
  secure: CONFIG.CORE.node_env === "production", 
  auth: {
    user: CONFIG.MAIL.service_user,
    pass: CONFIG.MAIL.mail_app_pass,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail Transporter Error:", error);
  } else {
    console.info("✅ Mail Transporter is ready to send emails");
  }
});
