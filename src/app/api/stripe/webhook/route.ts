import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getAdminDb } from "@/lib/firebase/admin";
import { assertStripeConfigured, getStripeWebhookSecret, stripe } from "@/lib/stripe";
import type { SubscriptionStatus } from "@/types/subscription";

const subscriptionStatusMap: Record<string, SubscriptionStatus> = {
  trialing: "trialing",
  active: "active",
  past_due: "past_due",
  canceled: "canceled",
  incomplete: "incomplete",
};

function mapStatus(status?: string): SubscriptionStatus {
  if (!status) {
    return "free";
  }

  return subscriptionStatusMap[status] ?? "free";
}

async function findUidByCustomer(customerId: string) {
  const userQuery = await getAdminDb()
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (userQuery.empty) {
    return null;
  }

  return userQuery.docs[0].id;
}

async function updateSubscriptionFromObject(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const uidFromMetadata = subscription.metadata?.uid;
  const uid = uidFromMetadata || (await findUidByCustomer(customerId));

  if (!uid) {
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id ?? null;

  await getAdminDb()
    .collection("users")
    .doc(uid)
    .set(
      {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        subscriptionStatus: mapStatus(subscription.status),
        updatedAt: new Date(),
      },
      { merge: true },
    );
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const subscriptionId = session.subscription as string | null;
  const customerId = session.customer as string | null;
  const uid = session.metadata?.uid || session.client_reference_id;

  if (!uid || !customerId) {
    return;
  }

  if (!subscriptionId) {
    await getAdminDb().collection("users").doc(uid).set(
      {
        stripeCustomerId: customerId,
        updatedAt: new Date(),
      },
      { merge: true },
    );
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await updateSubscriptionFromObject(subscription);
}

export async function POST(request: Request) {
  assertStripeConfigured();
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      getStripeWebhookSecret(),
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await updateSubscriptionFromObject(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
