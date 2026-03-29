import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-03-25.dahlia" as any, // fallback to any for strict typing bypass
    });

    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
    });

    const products = prices.data
      .map((price: any) => {
        const product = price.product;
        // Check if product is an object and is active
        if (product && typeof product === "object" && product.active) {
          return {
            id: price.id,
            productId: product.id,
            name: product.name,
            description: product.description || "",
            price: price.unit_amount ? price.unit_amount / 100 : 0,
            interval: price.recurring?.interval,
            marketing_features: product.features || product.marketing_features || [],
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.price - b.price);

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error fetching stripe products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
