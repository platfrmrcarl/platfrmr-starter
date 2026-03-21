"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createCheckoutSession } from "@/lib/billing-client";
import { useAuth } from "@/hooks/use-auth";

type PricingCardsProps = {
  monthlyPriceId: string;
};

export function PricingCards({ monthlyPriceId }: PricingCardsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      router.push("/login?next=/pricing");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      router.push(`/checkout?priceId=${monthlyPriceId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to open checkout.");
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Starter</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">Starting at $19/mo</h3>
        <p className="mt-1 text-sm text-slate-600">For early-stage products shipping their first premium experience.</p>
        <ul className="mt-5 space-y-2 text-sm text-slate-700">
          <li>Core authentication and billing flows</li>
          <li>Basic customer profile management</li>
          <li>Email support during launch</li>
        </ul>
      </article>

      <article className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Pro</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-950">Starting at $39/mo</h3>
        <p className="mt-1 text-sm text-slate-700">For SaaS teams that need premium controls and a faster growth path.</p>
        <ul className="mt-5 space-y-2 text-sm text-slate-800">
          <li>Everything in Starter</li>
          <li>Premium feature flags</li>
          <li>Priority support and roadmap input</li>
        </ul>
        <button
          type="button"
          disabled={isLoading}
          onClick={handleUpgrade}
          className="mt-6 rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"
        >
          {isLoading ? "Redirecting..." : "Start Pro"}
        </button>
        {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
      </article>

      <article className="rounded-2xl border border-slate-900 bg-slate-900 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Enterprise</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Starting at $99/mo</h3>
        <p className="mt-1 text-sm text-slate-300">For teams that need custom onboarding, stronger controls, and white-glove support.</p>
        <ul className="mt-5 space-y-2 text-sm text-slate-200">
          <li>Everything in Pro</li>
          <li>Advanced account management workflows</li>
          <li>Dedicated onboarding and support</li>
        </ul>
      </article>
    </div>
  );
}
