/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { CONFIG } from "../../../core/config";
import AppError from "../../../core/error/AppError";
import { User } from "../../../modules/base/user/user.model";
import { rootStripe } from "./root.stripe";

/**
 * StripeConnect → Handles Stripe Connect Accounts
 */
export class StripeConnect extends rootStripe {
  /**
   * Create a new Stripe Express Account & onboarding link
   */
  async createConnectAccount(
    email: string,
    country: string = "US",
    refreshUrl: string = `${CONFIG.CORE.backend_url}/stripe/reauth`,
    returnUrl: string = `${CONFIG.CORE.backend_url}/stripe/success`
  ) {
    try {
      const account = await this.stripe.accounts.create({
        type: "express",
        email,
        country,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding",
      });

      return {
        accountId: account.id,
        accountLink: accountLink.url,
      };
    } catch (err: any) {
      this.handleStripeError(err, "Stripe Connect Account Creation Failed");
      throw new AppError(httpStatus.BAD_GATEWAY, err.message);
    }
  }

  // --------------------------------------------------

  /**
   * Get or create a Stripe Connect account for APK flow
   */
  async getOrCreateAccountForAPK(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError(httpStatus.BAD_REQUEST, "User not found!");

    try {
      // Check if account already exists
      const accounts = await this.stripe.accounts.list({ limit: 100 });
      let account = accounts.data.find((acc) => acc.email === user.email);

      if (!account) {
        account = await this.stripe.accounts.create({
          type: "express",
          capabilities: {
            transfers: { requested: true },
            card_payments: { requested: true },
          },
          business_type: "individual",
          email: user.email,
        });
      }

      const returnUrl = `${CONFIG.CORE.backend_url}/stripe/apk/return?stripeAccountId=${account.id}&userId=${user._id}`;
      const refreshUrl = `${CONFIG.CORE.backend_url}/stripe/apk/refresh/${account.id}?userId=${user._id}`;

      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding",
      });

      return accountLink.url;
    } catch (err: any) {
      throw new AppError(httpStatus.BAD_GATEWAY, err.message);
    }
  }

  // --------------------------------------------------

  /**
   * Refresh account link for APK onboarding
   */
  async refreshAccountLinkForAPK(stripeAccountId: string, userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError(httpStatus.BAD_REQUEST, "User not found!");

    try {
      const returnUrl = `${CONFIG.CORE.backend_url}/stripe/apk/return?stripeAccountId=${stripeAccountId}&userId=${user._id}`;
      const refreshUrl = `${CONFIG.CORE.backend_url}/stripe/apk/refresh/${stripeAccountId}?userId=${user._id}`;

      const accountLink = await this.stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding",
      });

      return accountLink.url;
    } catch (err: any) {
      throw new AppError(httpStatus.BAD_REQUEST, err.message);
    }
  }

  // --------------------------------------------------

  /**
   * Handle return URL after APK onboarding
   * Updates user's Stripe account info
   */
  async handleReturnUrlForAPK(stripeAccountId: string, userId: string) {
    try {
      const account = await this.stripe.accounts.retrieve(stripeAccountId);
      const user = await User.findByIdAndUpdate(
        userId,
        {
          "stripeConnect.stripeAccountId": stripeAccountId,
          "stripeConnect.isActiveId": true,
          "stripeConnect.chargesEnabled": account.charges_enabled,
          "stripeConnect.payoutsEnabled": account.payouts_enabled,
        },
        { new: true }
      );

      if (!user) throw new AppError(httpStatus.BAD_REQUEST, "User not found!");

      return user;
    } catch (err: any) {
      throw new AppError(httpStatus.BAD_REQUEST, err.message);
    }
  }
}
