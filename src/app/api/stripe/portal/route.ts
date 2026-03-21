import { NextResponse } from "next/server";

import { getUidFromAuthorizationHeader } from "@/lib/auth-server";
import { getAdminDb } from "@/lib/firebase/admin";
import { assertStripeConfigured, stripe } from "@/lib/stripe";

export async function POST() {
  try {
    assertStripeConfigured();
    const uid = await getUidFromAuthorizationHeader();
    const adminDb = getAdminDb();
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const customerId = userSnap.data()?.stripeCustomerId as string | undefined;

    if (!customerId) {
      return NextResponse.json(
        { error: "No Stripe customer found for this user." },
        { status: 400 },
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Portal creation failed." },
      { status: 500 },
    );
  }
}
