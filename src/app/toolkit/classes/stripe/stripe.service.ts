/* eslint-disable no-console */
import httpStatus from "http-status";
import mongoose from "mongoose";
import { Stripe } from "stripe";
import AppError from "../../../core/error/AppError";
import { User } from "../../../modules/base/user/user.model";
import { Transaction } from "./modules/transaction/transaction.model";
import { rootStripe } from "./root.stripe";

export class StripeService extends rootStripe {
  constructor() {
    super();
  }

  // ----------------------------
  // Create Checkout Session
  // ----------------------------
  async createCheckoutSession(
    params: {
      lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
      mode: "payment" | "subscription";
      successUrl: string;
      cancelUrl: string;
      metadata: Record<string, string>;
      customerEmail?: string;
    },
    stripeAccount?: string
  ) {
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
        client_reference_id: params.metadata.userId,
      },
      options
    );
  }

  // ----------------------------
  // Retrieve Session
  // ----------------------------
  async getSession(sessionId: string, stripeAccount?: string) {
    const options = stripeAccount ? { stripeAccount } : undefined;
    return this.stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ["subscription.latest_invoice.payment_intent", "customer"] },
      options
    );
  }

  // ----------------------------
  // Refund Payment
  // ----------------------------
  async refundPayment(
    paymentIntentId: string,
    reason:
      | "duplicate"
      | "fraudulent"
      | "requested_by_customer" = "requested_by_customer",
    stripeAccount?: string
  ) {
    const options = stripeAccount ? { stripeAccount } : undefined;

    const refund = await this.stripe.refunds.create(
      { payment_intent: paymentIntentId, reason },
      options
    );

    // Update transaction status
    await Transaction.findOneAndUpdate(
      { stripePaymentIntent: paymentIntentId },
      { $set: { status: "refunded" } }
    );

    return refund;
  }

  // ----------------------------
  // Create Product + Price
  // ----------------------------
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
      { name: params.name, description: params.description },
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

  // ----------------------------
  // Subscription / Payment Success
  // ----------------------------
  async subscriptionSuccess(session_id: string) {
    if (!session_id) {
      throw new AppError(httpStatus.BAD_REQUEST, "session_id is required");
    }

    // Fetch session with expanded subscription invoice paymentIntent
    const session = await this.getSession(session_id);

    const userId = session.client_reference_id;
    if (!userId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "client_reference_id missing in session"
      );
    }

    // Determine subscription ID
    const subscriptionID = session.subscription
      ? (session.subscription as Stripe.Subscription).id
      : (session.metadata?.subscriptionID ?? null);

    const deadline = session.metadata?.deadline
      ? Number(session.metadata.deadline)
      : 0;

    const deadlineType = session.metadata?.deadlineType ?? "month";
    const issuedAt = session.metadata?.issuedAt ?? new Date();

    console.log({
      userId,
      subscriptionID,
      deadline,
      deadlineType,
      issuedAt,
    });

    // Start MongoDB transaction
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      const user = await User.isUserExistById(
        new mongoose.Types.ObjectId(userId)
      );
      if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

      // Update User payment
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            "payment.status": "paid",
            "payment.amount": session.amount_total
              ? session.amount_total / 100
              : 0,
            "payment.deadline": deadline,
            "payment.deadlineType": deadlineType,
            "payment.issuedAt": issuedAt,
            "payment.subscription": session.metadata?.subscriptionID ?? null,
          },
        },
        { session: mongoSession, new: true }
      );
      console.log(
        "🚀 ~ StripeService ~ subscriptionSuccess ~ updatedUser:",
        updatedUser
      );

      // Save transaction
      const transaction = await Transaction.create(
        [
          {
            userId,
            stripeSessionId: session.id || "",
            stripeSubId: subscriptionID || "",
            subscriptionId: session.metadata?.subscriptionID || "",
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency || "usd",
            status: "paid",
          },
        ],
        { session: mongoSession }
      );
      console.log(
        "🚀 ~ StripeService ~ subscriptionSuccess ~ transaction:",
        transaction
      );

      console.log({
        userId,
        stripeSessionId: session.id || "",
        subscriptionId: subscriptionID || "",
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency || "usd",
        status: "paid",
      });

      // Commit transaction
      await mongoSession.commitTransaction();
      mongoSession.endSession();

      return session;
    } catch (err) {
      console.log("🚀 ~ StripeService ~ subscriptionSuccess ~ err:", err);
      // Rollback only
      await mongoSession.abortTransaction();
      mongoSession.endSession();

      // Throw backend failure error
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Payment could not be processed due to backend failure"
      );
    }
  }

  // ----------------------------
  // Cancel Subscription
  // ----------------------------
  async cancelSubscription(
    subscriptionId: string,
    session_id: string,
    stripeAccount?: string
  ) {
    if (!session_id) {
      throw new AppError(httpStatus.BAD_REQUEST, "session_id is required");
    }

    const session = await this.getSession(session_id);

    const subscriptionID = session.subscription
      ? (session.subscription as Stripe.Subscription).id
      : session.metadata?.subscriptionID;
    if (!subscriptionID) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No subscriptionID found in session metadata"
      );
    }

    if (subscriptionId !== subscriptionID) {
      throw new AppError(httpStatus.BAD_REQUEST, "Subscription ID mismatch");
    }

    const deadline = session.metadata?.deadline
      ? Number(session.metadata.deadline)
      : 0;
    const deadlineType = session.metadata?.deadlineType ?? null;
    const issuedAt = session.metadata?.issuedAt ?? new Date();

    // Start MongoDB transaction
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      if (session.client_reference_id) {
        const userId = session.client_reference_id;

        await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              "payment.status": "canceled",
              "payment.amount": session.amount_total
                ? session.amount_total / 100
                : 0,
              "payment.deadline": deadline,
              "payment.deadlineType": deadlineType,
              "payment.issuedAt": issuedAt,
              "payment.subscription": subscriptionID,
            },
          },
          { session: mongoSession, new: true }
        );

        await Transaction.create(
          [
            {
              userId,
              stripeSessionId: session.id,
              subscriptionId: subscriptionID,
              amount: session.amount_total ? session.amount_total / 100 : 0,
              currency: session.currency || "usd",
              status: "canceled",
            },
          ],
          { session: mongoSession }
        );
      }

      await mongoSession.commitTransaction();
      mongoSession.endSession();

      const options = stripeAccount ? { stripeAccount } : undefined;
      return await this.stripe.subscriptions.cancel(
        subscriptionId,
        {},
        options
      );
    } catch (err) {
      await mongoSession.abortTransaction();
      mongoSession.endSession();

      // Refund if needed
      await this.refundPayment(session_id, "requested_by_customer");

      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Subscription cancel failed, payment refunded"
      );
    }
  }
}
