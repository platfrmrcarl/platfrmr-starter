import { NextResponse } from "next/server";
import Stripe from "stripe";
import * as admin from "firebase-admin";

// Avoid re-initializing Firebase Admin if it's already spun up
if (!admin.apps.length) {
  admin.initializeApp({
    credential: process.env.FIREBASE_PRIVATE_KEY
      ? admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle Next.js escaping newlines in .env.local string
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
      : admin.credential.applicationDefault(), // Relies on GOOGLE_APPLICATION_CREDENTIALS
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}
const db = admin.firestore();

export async function POST(req: Request) {
  // Capture raw body for Stripe signature validation
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing Stripe signature or Webhook Secret");
    }
    
    // We need stripe here just to verify signature
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-03-25.dahlia" as any,
    });
    
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  // Handle the event
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-03-25.dahlia" as any,
    });
    
    switch (event.type) {
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Retrieve the customer from Stripe to find the associated Firebase user ID
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;

        if (customer && customer.metadata && customer.metadata.firebaseUID) {
          const userId = customer.metadata.firebaseUID;
          
          let planName = "pro";
          let credits = 5000;

          if (invoice.lines && invoice.lines.data.length > 0) {
            // In Stripe's InvoiceLineItem type, price is actually inside price object
            const lineItem = invoice.lines.data[0] as any;
            const price = lineItem.price;
            if (price && price.product) {
              const product = await stripe.products.retrieve(price.product as string);
              if (product && product.name) {
                planName = product.name.toLowerCase();
                if (planName.includes('starter')) credits = 1000;
                else if (planName.includes('enterprise')) credits = 10000;
                else if (planName.includes('pro')) credits = 5000;
                else if (planName.includes('basic')) credits = 2500;
              }
            }
          }
          
          // Update the user's document in Firestore securely via backend
          await db.collection("users").doc(userId).set({
            subscriptionStatus: "active",
            subscription: planName,
            stripeCustomerId: customerId,
            credits: credits,
          }, { merge: true });
          console.log(`Updated user ${userId} to active subscription ${planName} with ${credits} credits.`);
        }
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        
        if (customer && customer.metadata && customer.metadata.firebaseUID) {
          const userId = customer.metadata.firebaseUID;
          
          await db.collection("users").doc(userId).set({
            subscriptionStatus: "none",
            subscription: "basic",
          }, { merge: true });
          console.log(`Downgraded user ${userId} to basic subscription.`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Error processing webhook: ${error.message}`);
    return NextResponse.json({ error: "Db processing failed." }, { status: 500 });
  }
}
