/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import httpStatus from "http-status";
import mongoose from "mongoose";
import { Stripe } from "stripe";
import AppError from "../../../core/error/AppError";
import { User } from "../../../modules/base/user/user.model";
import { rootStripe } from "./root.stripe";

/**
 * StripeService → Business Logic Layer
 */
export class StripeService extends rootStripe {
  /**
   * Create Checkout Session (Connect Account supported)
   */

  constructor() {
    super();
  }

  async createCheckoutSession(
    params: {
      lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
      mode: "payment" | "subscription";
      successUrl: string;
      cancelUrl: string;
      metadata?: Record<string, string>;
      customerEmail?: string;
    },
    stripeAccount?: string
  ) {
    try {
      const options = stripeAccount ? { stripeAccount } : undefined;

      return await this.stripe.checkout.sessions.create(
        {
          payment_method_types: ["card"],
          line_items: params.lineItems,
          mode: params.mode,
          success_url: params.successUrl,
          cancel_url: params.cancelUrl,
          metadata: params.metadata,
          customer_email: params.customerEmail,
        },
        options
      );
    } catch (err) {
      this.handleStripeError(err, "Checkout Session Creation Failed");
      throw err;
    }
  }

  // --------------------------------------------------

  /**
   * Retrieve Session (Connect Account supported)
   */
  async getSession(sessionId: string, stripeAccount?: string) {
    const options = stripeAccount ? { stripeAccount } : undefined;
    return this.stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ["line_items", "customer"] },
      options
    );
  }

  // --------------------------------------------------

  /**
   * Refund Payment (Connect Account supported)
   */
  async refundPayment(
    paymentIntentId: string,
    reason:
      | "duplicate"
      | "fraudulent"
      | "requested_by_customer" = "requested_by_customer",
    stripeAccount?: string
  ) {
    const options = stripeAccount ? { stripeAccount } : undefined;
    return this.stripe.refunds.create(
      { payment_intent: paymentIntentId, reason },
      options
    );
  }

  // --------------------------------------------------

  /**
   * Cancel Subscription (Connect Account supported)
   */
  async cancelSubscription(subscriptionId: string, stripeAccount?: string) {
    const options = stripeAccount ? { stripeAccount } : undefined;
    return this.stripe.subscriptions.cancel(subscriptionId, {}, options);
  }

  // --------------------------------------------------

  /**
   * Create Product + Price (Connect Account supported)
   */
  async createProductWithPrice(
    params: {
      name: string;
      description?: string;
      unitAmount: number;
      currency: string;
      recurringInterval?: "day" | "week" | "month" | "year";
    },
    stripeAccount?: string
  ) {
    const options = stripeAccount ? { stripeAccount } : undefined;

    const product = await this.stripe.products.create(
      {
        name: params.name,
        description: params.description,
      },
      options
    );

    const price = await this.stripe.prices.create(
      {
        product: product.id,
        unit_amount: params.unitAmount,
        currency: params.currency,
        ...(params.recurringInterval
          ? { recurring: { interval: params.recurringInterval } }
          : {}),
      },
      options
    );

    return { product, price };
  }

  // --------------------------------------------------

  /**
   * Handle Webhook Events (Connect Account supported)
   */
  async handleWebhookEvent(event: Stripe.Event) {
    try {
      const data = event.data.object as any;

      // userId safely extract from metadata
      const userId =
        data.metadata && new mongoose.Types.ObjectId(data.metadata.userId);

      switch (event.type) {
        case "checkout.session.completed":
          await this.notifyUserAndAdmin({
            subject: "Checkout Session Completed",
            body: `${data.customer} has completed checkout session ${data.id}.`,
            message: JSON.stringify(data, null, 2),
            userId,
          });
          break;

        case "payment_intent.payment_failed":
          await this.notifyUserAndAdmin({
            subject: "Payment Failed",
            body: `${data.customer} has failed checkout session ${data.id}.`,
            message: JSON.stringify(data, null, 2),
            userId,
          });
          break;

        case "customer.subscription.deleted":
          await this.notifyUserAndAdmin({
            subject: "Subscription Deleted",
            body: `${data.customer} has deleted their subscription ${data.id}.`,
            message: JSON.stringify(data, null, 2),
            userId,
          });
          break;

        default:
          console.info(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      this.handleStripeError(err, `Webhook Handling Failed: ${event.type}`);
    }
  }

  async paymentSuccessStripe(payload: any) {
    if (!payload.session_id) {
      throw new AppError(httpStatus.BAD_REQUEST, "session_id is required");
    }

    const session = await this.stripe.checkout.sessions.retrieve(
      payload.session_id,
      {
        expand: ["line_items", "customer"],
      }
    );

    const subscriptionID = session.metadata?.subscriptionID || null;

    if (session.client_reference_id) {
      const userId = session.client_reference_id as string;
      const deadline = Number(session.metadata!.deadline);

      const user = await User.isUserExistById(userId as any);

      if (user?.payment?.status === "paid") {
        throw new AppError(httpStatus.BAD_REQUEST, "User is already paid");
      }

      await User.findByIdAndUpdate(userId, {
        $set: {
          "payment.status": "paid",
          "payment.amount": session?.amount_total
            ? session.amount_total / 100
            : 0,
          "payment.deadline": deadline || 0,
          "payment.deadlineType": session.metadata!.deadlineType || null,
          "payment.issuedAt": session.metadata!.issuedAt || new Date(),
          "payment.subscription": subscriptionID,
        },
      });
    }

    return session;
  }
}
