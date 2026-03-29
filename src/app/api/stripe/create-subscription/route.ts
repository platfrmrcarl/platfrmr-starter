import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { email, userId, priceId } = await req.json();

    if (!email || !userId) {
      return NextResponse.json({ error: "Email and userId are required" }, { status: 400 });
    }

    const selectedPriceId = priceId || process.env.STRIPE_PRICE_ID || "price_PRO_TIER";

    // Initialize with a supported stable API version
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: '2023-10-16' as any,
    });
    
    const customer = await stripe.customers.create({
      email,
      metadata: {
        firebaseUID: userId,
      },
    });

    // Create the subscription using the generic testing/production price ID
    // You should replace 'price_PRO_TIER' with your actual Stripe Price ID
    const subscriptionParams: Stripe.SubscriptionCreateParams = {
      customer: customer.id,
      items: [{
        price: selectedPriceId,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    };

    const subscription = await stripe.subscriptions.create(subscriptionParams);

    // Cast the specific types correctly
    const invoice = subscription.latest_invoice as any;
    
    if (!invoice) {
      throw new Error("No invoice returned from subscription creation.");
    }
    if (typeof invoice === 'string') {
      throw new Error("Invoice was not expanded properly by Stripe.");
    }

    const paymentIntent = invoice.payment_intent;

    if (typeof paymentIntent === 'string') {
      throw new Error("Payment intent was not expanded properly by Stripe.");
    }

    if (!paymentIntent) {
      // Could be null for free trials or 100% discount coupons
      // Since it's free, return subscriptionId and a 'free' flag so client knows
      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: null,
        isFree: true,
      });
    }

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret || null,
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
