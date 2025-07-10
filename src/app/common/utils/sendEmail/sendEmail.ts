/* eslint-disable no-console */
import { CONFIG } from "../../../core/config";
import { transporter } from "./mail.transporter";

export const sendEmail = async (
  to: string,
  subject: string,
  htmlEmailBody: string
) => {
  // Validate the recipient email
  if (!to || !to.includes("@")) {
    console.error("❌ Invalid email recipient:", to);
    throw new Error("Recipient email address is missing or invalid.");
  }

  try {
    const info = await transporter.sendMail({
      from: CONFIG.MAIL.send_from,
      to,
      subject,
      text: `Set your new password within ${CONFIG.MAIL.otp_expires} minutes`,
      html: htmlEmailBody,
    });

    console.info("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};
