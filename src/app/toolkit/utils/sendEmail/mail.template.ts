import { CONFIG } from "../../../core/config";

export const otpMailTemplate = (otp: number): string => `
  <div style="
    max-width: 600px;
    margin: 0 auto;
    background-color: #f4f6f8;
    padding: 40px 30px;
    border-radius: 18px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    color: #1a1a1a;
    box-sizing: border-box;
    border: 1px solid #e5e7eb;
  ">

    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="
        font-size: 26px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 8px;
      ">
        🔐 Your One-Time Code
      </h1>
      <p style="font-size: 15px; color: #4b5563; margin: 0;">
        Use the secure OTP below to proceed.
      </p>
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <div style="
        display: inline-block;
        background: #ffffff;
        padding: 22px 50px;
        border-radius: 16px;
        font-size: 36px;
        font-weight: bold;
        color: #111827;
        letter-spacing: 10px;
        box-shadow:
          4px 4px 15px rgba(0, 0, 0, 0.05),
          -4px -4px 15px rgba(255, 255, 255, 0.9),
          inset 0 1px 2px rgba(0,0,0,0.05);
        border: 1px solid #e0e0e0;
      ">
        ${otp}
      </div>
    </div>

    <p style="
      font-size: 14px;
      color: #6b7280;
      text-align: center;
      margin: 0 0 30px;
      line-height: 1.6;
    ">
      This code is valid for
      <span style="color: #d97706; font-weight: 600;">
        ${CONFIG.MAIL.otp_expires} minutes
      </span>.
      <br/>
      If you didn't request it, simply ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

    <div style="text-align: center; font-size: 13px; color: #9ca3af;">
      Need help? Contact us at
      <a href="mailto:support@yourcompany.com" style="color: #d97706; text-decoration: none;">
        support@yourcompany.com
      </a><br/><br/>
      © ${new Date().getFullYear()} YourCompany. All rights reserved.
    </div>
  </div>
`;
