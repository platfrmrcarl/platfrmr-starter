"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

function ReturnContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) return;
      try {
        // Fetch session status. We can create an API endpoint or just use redirect 
        // For simplicity, we can fetch from an API route we will create:
        const response = await fetch(`/api/stripe/checkout/session?session_id=${sessionId}`);
        const data = await response.json();
        if (data.status === 'open') {
          router.push('/checkout');
        } else if (data.status === 'complete') {
          setStatus('complete');
        } else {
          setStatus(data.status);
        }
      } catch (err) {
        setStatus("error");
      }
    }
    fetchSession();
  }, [sessionId, router]);

  if (status === 'complete') {
    return (
      <section id="success" className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
        <p className="text-slate-600 mb-8">
          Thank you for subscribing. Your account is now active.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="rounded-full bg-cyan-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
        >
          Go to Dashboard
        </button>
      </section>
    );
  }

  return <p className="text-center text-slate-500">Checking payment status...</p>;
}

export default function ReturnPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <Suspense fallback={<div>Loading...</div>}>
          <ReturnContent />
        </Suspense>
      </div>
    </main>
  );
}
