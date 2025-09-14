import { WebhookService } from "./stripe.webhook";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONFIG } from "../../../core/config";
import { StripeService } from "./stripe.service";

export class StripePaymentHandler {
  private stripeService: StripeService;
  private webhook;

  constructor() {
    this.stripeService = new StripeService();
    this.webhook = new WebhookService();
  }

  // --------------------------------------------------
  // Pay for Product
  async payProduct(params: {
    lineItems: { price: string; quantity: number }[];
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    userId?: string;
    stripeAccount?: string;
  }) {
    const metadata: Record<string, string> = params.userId
      ? { userId: params.userId }
      : {};

    return this.stripeService.createCheckoutSession(
      {
        lineItems: params.lineItems,
        mode: "payment",
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl,
        metadata,
      },
      params.stripeAccount
    );
  }

  // * --------------------------------------------------
  // Pay for Subscription

  async paySubscription(params: {
    lineItems: {
      name: string;
      amount: number;
      quantity: number;
      currency?: string;
      interval?: "month" | "year";
    }[];
    successUrl?: string;
    cancelUrl?: string;
    stripeAccount?: string;
    metadata: {
      customerEmail: string;
      userId: string;
      subscriptionId: string;
    };
  }) {
    const stripeLineItems = params.lineItems.map((item) => ({
      price_data: {
        currency: item.currency || "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.amount * 100),
        recurring: { interval: item.interval || "month" },
      },
      quantity: item.quantity,
    }));

    const checkoutSession = await this.stripeService.createCheckoutSession(
      {
        lineItems: stripeLineItems,
        mode: "subscription",
        successUrl:
          params.successUrl ||
          `${CONFIG.CORE.backend_url}/subscription/success-api-stripe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl:
          params.cancelUrl ||
          `${CONFIG.CORE.backend_url}/subscription/success-api-stripe/cancel?session_id={CHECKOUT_SESSION_ID}`,
        metadata: params.metadata,
      },
      params.stripeAccount
    );

    return { url: checkoutSession.url };
  }

  // --------------------------------------------------
  // Cancel Payment
  async subscriptionSuccess(params: { session_id: string }) {
    return this.stripeService.subscriptionSuccess(params.session_id);
  }

  // --------------------------------------------------
  // Refund Payment
  async refund(params: {
    paymentIntentId: string;
    reason?: "duplicate" | "fraudulent" | "requested_by_customer";
    stripeAccount?: string;
  }) {
    return this.stripeService.refundPayment(
      params.paymentIntentId,
      params.reason,
      params.stripeAccount
    );
  }

  // --------------------------------------------------
  // Cancel Subscription
  async cancelSubscription(params: {
    subscriptionId: string;
    stripeAccount?: string;
    session_id: string;
  }) {
    return this.stripeService.cancelSubscription(
      params.subscriptionId,
      params.stripeAccount as string,
      params.session_id
    );
  }

  // --------------------------------------------------
  // Handle Webhook Event (Payment Success / Failed / Subscription Deleted)
  async handleWebhook(event: any) {
    return this.webhook.handleWebhookEvent(event);
  }

  // --------------------------------------------------
  // Create Product + Price (Admin Use)
  async createProduct(params: {
    name: string;
    unitAmount: number;
    currency: string;
    recurringInterval?: "day" | "week" | "month" | "year";
    description?: string;
    stripeAccount?: string;
  }) {
    return this.stripeService.createProductWithPrice(
      {
        name: params.name,
        description: params.description,
        unitAmount: params.unitAmount,
        currency: params.currency,
        recurringInterval: params.recurringInterval,
      },
      params.stripeAccount
    );
  }
}
