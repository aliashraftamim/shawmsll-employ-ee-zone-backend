/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import Stripe from "stripe";
import { CONFIG } from "../../../core/config";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { sendAdminNotifications } from "../../../modules/base/notification/notification.send.admin";
import { sendNotification } from "../../../modules/base/notification/notification.utils";
import { User } from "../../../modules/base/user/user.model";
import { sendEmail } from "../../utils/sendEmail/sendEmail";

/**
 * BaseStripe → Common utilities
 */
export abstract class rootStripe {
  readonly stripe: Stripe;

  constructor(apiVersion: Stripe.LatestApiVersion = "2025-04-30.basil") {
    this.stripe = new Stripe(CONFIG.STRIPE.stripe_secret_key as string, {
      apiVersion,
    });
  }

  /**
   * Centralized Error Handler
   */
  protected handleStripeError(err: any, context: string) {
    console.error(`[Stripe Error] ${context}:`, err.message);
    // Future: log to DB / Sentry
  }

  /**
   * Notify User + Admin
   */
  protected async notifyUserAndAdmin(data: {
    subject: string;
    body: string;
    message: string;
    userId: mongoose.Types.ObjectId;
  }) {
    const { subject, body, message, userId } = data;

    const user = await User.isUserExistById(userId);

    if (!user) return;

    await sendEmail(
      CONFIG.CORE.supper_admin_email as string,
      subject,
      JSON.stringify(body, null, 2)
    );
    await sendEmail(
      user?.email as string,
      subject,
      JSON.stringify(body, null, 2)
    );

    await sendAdminNotifications({
      title: subject,
      message,
    });

    await sendNotification([user?.fcmToken as string], {
      title: subject,
      receiver: userId,
      receiverEmail: user?.email,
      receiverRole: USER_ROLE.USER,
      message,
    });
  }
}
