import Stripe from "stripe";

const fallbackSecret = "sk_test_placeholder";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? fallbackSecret, {
  apiVersion: "2026-02-25.clover",
});

export function assertStripeConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing environment variable: STRIPE_SECRET_KEY");
  }
}

export function getStripeWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("Missing environment variable: STRIPE_WEBHOOK_SECRET");
  }

  return secret;
}
