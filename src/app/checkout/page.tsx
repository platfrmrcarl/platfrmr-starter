"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { createCheckoutSession } from "@/lib/billing-client";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const priceId = searchParams.get("priceId") ?? undefined;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchClientSecret() {
      try {
        const data = await createCheckoutSession(priceId);
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError("Failed to create checkout session.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load checkout.");
      }
    }
    fetchClientSecret();
  }, [priceId]);

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-500">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-center text-3xl font-semibold text-slate-900">
        Complete your subscription
      </h1>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <Suspense fallback={<div>Loading...</div>}>
          <CheckoutContent />
        </Suspense>
      </div>
    </main>
  );
}
