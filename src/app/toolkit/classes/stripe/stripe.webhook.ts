/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import Stripe from "stripe";
import { rootStripe } from "./root.stripe";

export class WebhookService extends rootStripe {
  /**
   * Handle Webhook Events (Connect Account supported)
   */
  async handleWebhookEvent(event: Stripe.Event) {
    try {
      const data = event.data.object as any;

      // userId safely extract from metadata
      const userId = data?.metadata?.userId
        ? new mongoose.Types.ObjectId(data.metadata.userId)
        : null;

      if (!userId) {
        console.warn("⚠️ No userId found in metadata.");
        return;
      }

      switch (event.type) {
        case "checkout.session.completed":
          await this.notifyUserAndAdmin({
            subject: "Checkout Completed",
            body: `${data.customer} completed session ${data.id}`,
            message: JSON.stringify(data, null, 2),
            userId,
          });
          break;

        case "payment_intent.payment_failed":
          await this.notifyUserAndAdmin({
            subject: "Payment Failed",
            body: `${data.customer} failed session ${data.id}`,
            message: JSON.stringify(data, null, 2),
            userId,
          });
          break;

        case "customer.subscription.deleted":
          await this.notifyUserAndAdmin({
            subject: "Subscription Canceled",
            body: `${data.customer} canceled subscription ${data.id}`,
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
}
