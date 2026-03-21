"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const priceId = searchParams.get("priceId") ?? undefined;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClientSecret() {
      try {
        setIsLoading(true);
        setError("");
        const data = await createCheckoutSession(priceId);
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError("Failed to create checkout session. Please try again.");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load checkout.";
        console.error("Checkout error:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClientSecret();
  }, [priceId]);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-900">Checkout Error</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600"></div>
        <p className="text-slate-600">Setting up your checkout...</p>
      </div>
    );
  }

  return (
    <div id="checkout" className="rounded-lg border border-slate-200 bg-slate-50 p-6">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Upgrade to Pro
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Get access to all premium features. Secure payment powered by Stripe.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
            <p className="mt-1 text-sm text-slate-600">
              Enter your credit card information to complete your subscription
            </p>
          </div>
          
          <div className="p-6 sm:p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-600"></div>
              </div>
            }>
              <CheckoutContent />
            </Suspense>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-600">
            💳 Your payment is secure and encrypted. We use Stripe to securely process your payment.
          </p>
        </div>
      </div>
    </main>
  );
}
