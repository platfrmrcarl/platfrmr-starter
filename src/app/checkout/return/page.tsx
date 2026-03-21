"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Check, AlertCircle, Loader } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

function ReturnContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) {
        setError("Missing session ID");
        return;
      }
      try {
        const response = await fetch(
          `/api/stripe/checkout/session?session_id=${sessionId}`
        );
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || "Failed to fetch session status");
          return;
        }

        if (data.status === "open") {
          router.push("/checkout");
        } else if (data.status === "complete") {
          setStatus("complete");
          setEmail(data.customer_email || "");
        } else {
          setStatus(data.status);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check payment status";
        setError(errorMessage);
      }
    }
    fetchSession();
  }, [sessionId, router]);

  if (error) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-slate-600">{error}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => router.push("/checkout")}
            className="rounded-lg bg-cyan-600 px-6 py-2 font-semibold text-white hover:bg-cyan-700"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-slate-300 px-6 py-2 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (status === "complete") {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            🎉 Payment Successful!
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            Thank you for subscribing to our premium plan.
          </p>
          {email && (
            <p className="mt-2 text-sm text-slate-500">
              Confirmation sent to <span className="font-medium">{email}</span>
            </p>
          )}
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">
            ✓ Your subscription is now active<br />
            ✓ You have access to all premium features<br />
            ✓ Your billing information has been saved securely
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-lg bg-cyan-600 px-8 py-3 font-semibold text-white hover:bg-cyan-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <Loader className="mx-auto h-8 w-8 animate-spin text-cyan-600" />
      <p className="text-slate-600">Verifying your payment...</p>
    </div>
  );
}

export default function ReturnPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-10">
        <Suspense
          fallback={
            <div className="space-y-4 text-center">
              <Loader className="mx-auto h-8 w-8 animate-spin text-cyan-600" />
              <p className="text-slate-600">Loading...</p>
            </div>
          }
        >
          <ReturnContent />
        </Suspense>
      </div>
    </main>
  );
}
