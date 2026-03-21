import { NextResponse } from "next/server";

import { getUidFromAuthorizationHeader } from "@/lib/auth-server";
import { getAdminDb } from "@/lib/firebase/admin";
import { assertStripeConfigured, stripe } from "@/lib/stripe";

// Log environment variables (helpful for debugging)
if (process.env.NODE_ENV === "development") {
  console.log("Checkout API - Environment Check:", {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? "✓" : "✗",
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? "✓" : "✗",
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? `✓ (${process.env.FIREBASE_PRIVATE_KEY.length} chars)` : "✗",
  });
}

export async function POST(request: Request) {
  try {
    assertStripeConfigured();
    
    let uid: string;
    try {
      uid = await getUidFromAuthorizationHeader();
    } catch (authError) {
      console.error("Auth error:", authError instanceof Error ? authError.message : String(authError));
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 },
      );
    }

    let adminDb;
    try {
      adminDb = getAdminDb();
    } catch (dbError) {
      console.error("Database initialization error:", dbError instanceof Error ? dbError.message : String(dbError));
      return NextResponse.json(
        { 
          error: "Server configuration error. Contact support if this persists.\n" +
                 (dbError instanceof Error ? dbError.message : "Database unavailable")
        },
        { status: 500 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as { priceId?: string };
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const defaultPriceId =
      process.env.STRIPE_MONTHLY_PRICE_ID ?? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;
    const priceId = body.priceId || defaultPriceId;

    if (!priceId) {
      return NextResponse.json(
        { 
          error: "Stripe product not configured. Please add STRIPE_MONTHLY_PRICE_ID or NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID to your environment variables. Visit your Stripe dashboard to create a product and get the price ID." 
        },
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
      ui_mode: "embedded",
      return_url: `${siteUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      allow_promotion_codes: true,
      client_reference_id: uid,
      metadata: { uid },
      subscription_data: {
        metadata: { uid },
      },
    });

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Failed to create checkout session. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Checkout failed.";
    console.error("Stripe checkout error:", errorMessage, error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}
