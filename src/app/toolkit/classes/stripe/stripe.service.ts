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

  /**
   * Create Checkout Session (Connect Account supported)
   */
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

    const refund = await this.stripe.refunds.create(
      { payment_intent: paymentIntentId, reason },
      options
    );

    // Update transaction status to refunded
    await Transaction.findOneAndUpdate(
      { stripePaymentIntent: paymentIntentId },
      { $set: { status: "refunded" } }
    );

    return refund;
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
   * Subscription Success Handler
   * → Uses MongoDB transaction + rollback + automatic refund
   */
  async subscriptionSuccess(session_id: string) {
    if (!session_id) {
      throw new AppError(httpStatus.BAD_REQUEST, "session_id is required");
    }

    const session = await this.getSession(session_id);

    const subscriptionID = session.metadata?.subscriptionID ?? null;
    const deadline = session.metadata?.deadline
      ? Number(session.metadata.deadline)
      : 0;
    const deadlineType = session.metadata?.deadlineType ?? null;
    const issuedAt = session.metadata?.issuedAt ?? new Date();

    if (!session.client_reference_id) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "client_reference_id missing in session"
      );
    }

    const userId = session.client_reference_id;

    // Start MongoDB transaction
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      const user = await User.isUserExistById(
        new mongoose.Types.ObjectId(userId)
      );
      if (user?.payment?.status === "paid") {
        await mongoSession.abortTransaction();
        mongoSession.endSession();
        return session; // Idempotent → already paid
      }

      // Update User payment
      await User.findByIdAndUpdate(
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
            "payment.subscription": subscriptionID,
          },
        },
        { session: mongoSession, new: true }
      );

      // Save transaction
      await Transaction.create(
        [
          {
            userId,
            stripeSessionId: session.id,
            stripePaymentIntent: session.payment_intent as string,
            subscriptionId: subscriptionID || "",
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency || "usd",
            status: "paid",
          },
        ],
        { session: mongoSession }
      );

      // Commit transaction
      await mongoSession.commitTransaction();
      mongoSession.endSession();

      return session;
    } catch (err) {
      // Rollback
      await mongoSession.abortTransaction();
      mongoSession.endSession();

      // Refund Stripe payment
      await this.refundPayment(
        session.payment_intent as string,
        "requested_by_customer"
      );

      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Payment refunded due to backend failure"
      );
    }
  }

  // --------------------------------------------------

  /**
   * Cancel Subscription (Connect Account supported)
   */
  async cancelSubscription(
    subscriptionId: string,
    session_id: string,
    stripeAccount?: string
  ) {
    if (!session_id) {
      throw new AppError(httpStatus.BAD_REQUEST, "session_id is required");
    }

    const session = await this.getSession(session_id);

    const subscriptionID = session.metadata?.subscriptionID;
    if (!subscriptionID) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No subscriptionID found in session metadata"
      );
    }

    if (subscriptionId !== subscriptionID) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Subscription ID mismatch between request and session metadata"
      );
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

        // Update user payment status
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

        // Save transaction for cancellation
        await Transaction.create(
          [
            {
              userId,
              stripeSessionId: session.id,
              stripePaymentIntent: session.payment_intent as string,
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

      // Optionally: trigger refund if needed
      await this.refundPayment(
        session.payment_intent as string,
        "requested_by_customer"
      );

      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Subscription cancel failed, payment refunded"
      );
    }
  }
}
