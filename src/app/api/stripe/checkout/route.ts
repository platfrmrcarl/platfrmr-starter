import { NextResponse } from "next/server";

import { getUidFromAuthorizationHeader } from "@/lib/auth-server";
import { getAdminDb } from "@/lib/firebase/admin";
import { assertStripeConfigured, stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    assertStripeConfigured();
    const uid = await getUidFromAuthorizationHeader();
    const adminDb = getAdminDb();
    const body = (await request.json().catch(() => ({}))) as { priceId?: string };
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const defaultPriceId =
      process.env.STRIPE_MONTHLY_PRICE_ID ?? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;
    const priceId = body.priceId || defaultPriceId;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe price ID." },
        { status: 400 },
      );
    }

    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data() ?? {};
    let customerId: string | undefined = userData.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { uid },
      });
      customerId = customer.id;

      await userRef.set(
        {
          stripeCustomerId: customerId,
          updatedAt: new Date(),
        },
        { merge: true },
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/dashboard/billing?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      client_reference_id: uid,
      metadata: { uid },
      subscription_data: {
        metadata: { uid },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed." },
      { status: 500 },
    );
  }
}
