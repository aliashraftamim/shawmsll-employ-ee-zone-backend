/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import sgMail from "@sendgrid/mail";
import { CONFIG } from "../../../core/config";

// Initialize SendGrid
sgMail.setApiKey(CONFIG.MAIL.send_grid_api_key!);

export const sendEmail = async (
  to: string,
  subject: string,
  htmlEmailBody: string
) => {
  // Validate recipient email
  if (!to || !to.includes("@")) {
    console.error("❌ Invalid email recipient:", to);
    throw new Error("Recipient email address is missing or invalid.");
  }

  const msg = {
    to,
    from: CONFIG.MAIL.send_from?.toString() as string, // Must be a verified sender in SendGrid
    subject,
    text: `Set your new password within ${CONFIG.MAIL.otp_expires} minutes`,
    html: htmlEmailBody,
  };

  try {
    const [response] = await sgMail.send(msg);
    console.info("✅ Email sent successfully:", response.statusCode);
  } catch (error: any) {
    console.error("❌ Failed to send email:", error.response?.body || error);
    throw error;
  }
};

// /* eslint-disable no-console */
// import { CONFIG } from "../../../core/config";
// import { transporter } from "./mail.transporter";

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   htmlEmailBody: string
// ) => {
//   // Validate the recipient email
//   if (!to || !to.includes("@")) {
//     console.error("❌ Invalid email recipient:", to);
//     throw new Error("Recipient email address is missing or invalid.");
//   }

//   try {
//     const info = await transporter.sendMail({
//       from: CONFIG.MAIL.send_from,
//       to,
//       subject,
//       text: `Set your new password within ${CONFIG.MAIL.otp_expires} minutes`,
//       html: htmlEmailBody,
//     });

//     console.info("✅ Email sent:", info.messageId);
//   } catch (error) {
//     console.error("❌ Failed to send email:", error);
//     throw error;
//   }
// };
