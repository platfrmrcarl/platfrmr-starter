"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function CheckoutContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const priceId = searchParams.get("price") || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || "price_pro"; 
  
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }

    if (!loading && user && !clientSecret) {
      const initCheckout = async () => {
        try {
          const response = await fetch("/api/stripe/create-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, userId: user.uid, priceId }),
          });

          const data = await response.json();
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else if (data.isFree) {
            // If it's a free subscription (no payment intent required)
            router.push("/app");
          } else {
            setError(data.error?.message || "Failed to initialize checkout.");
          }
        } catch (err) {
          setError("Failed to generate stripe configuration.");
        }
      };

      initCheckout();
    }
  }, [user, loading, router, clientSecret, priceId]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-lg p-8">
        <div className="card-body gap-6 px-0 md:px-4">
          <h1 className="text-3xl font-bold text-center mb-2">Checkout</h1>
          <p className="text-center text-base-content/70 mb-6">Complete your subscription checkout below</p>
          
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {!clientSecret && !error ? (
            <div className="flex justify-center my-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#2666E2' } } } as any}>
              <CheckoutForm />
            </Elements>
          ) : null}
          
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center h-full mt-20"><span className="loading loading-spinner loading-lg"></span></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
