import { NextResponse } from "next/server";
import { assertStripeConfigured, stripe } from "@/lib/stripe";

export async function GET(request: Request) {
  try {
    assertStripeConfigured();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch session" },
      { status: 500 }
    );
  }
}
