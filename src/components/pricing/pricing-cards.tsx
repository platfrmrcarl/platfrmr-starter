"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

type PricingCardsProps = {
  basicPriceId: string;
  proPriceId: string;
  enterprisePriceId: string;
};

export function PricingCards({ basicPriceId, proPriceId, enterprisePriceId }: PricingCardsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = (priceId: string, planName: string) => {
    if (!user) {
      router.push("/login?next=/pricing");
      return;
    }

    if (!priceId) {
      setError(`${planName} price ID is not configured. Please update your environment variables.`);
      return;
    }

    if (priceId.startsWith("prod_")) {
      setError(
        `${planName} uses a Stripe product ID. Use a Stripe price ID (starts with \"price_\") in your environment variables.`,
      );
      return;
    }

    try {
      setLoadingPlan(planName);
      setError("");
      router.push(`/checkout?priceId=${priceId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to open checkout.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Starter Plan */}
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Starter</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">Starting at $19/mo</h3>
        <p className="mt-1 text-sm text-slate-600">For early-stage products shipping their first premium experience.</p>
        <ul className="mt-5 space-y-2 text-sm text-slate-700">
          <li>✓ Core authentication and billing flows</li>
          <li>✓ Basic customer profile management</li>
          <li>✓ Email support during launch</li>
        </ul>
        <button
          type="button"
          disabled={loadingPlan === "Starter"}
          onClick={() => handleCheckout(basicPriceId, "Starter")}
          className="mt-6 w-full rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-300 disabled:opacity-60"
        >
          {loadingPlan === "Starter" ? "Redirecting..." : "Choose Starter"}
        </button>
      </article>

      {/* Pro Plan */}
      <article className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm ring-2 ring-cyan-600 ring-offset-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Pro</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-950">Starting at $39/mo</h3>
        <p className="mt-1 text-sm text-slate-700">For SaaS teams that need premium controls and a faster growth path.</p>
        <ul className="mt-5 space-y-2 text-sm text-slate-800">
          <li>✓ Everything in Starter</li>
          <li>✓ Premium feature flags</li>
          <li>✓ Priority support and roadmap input</li>
        </ul>
        <button
          type="button"
          disabled={loadingPlan === "Pro"}
          onClick={() => handleCheckout(proPriceId, "Pro")}
          className="mt-6 w-full rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"
        >
          {loadingPlan === "Pro" ? "Redirecting..." : "Choose Pro"}
        </button>
      </article>

      {/* Enterprise Plan */}
      <article className="rounded-2xl border border-slate-900 bg-slate-900 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Enterprise</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Starting at $99/mo</h3>
        <p className="mt-1 text-sm text-slate-300">For teams that need custom onboarding, stronger controls, and white-glove support.</p>
        <ul className="mt-5 space-y-2 text-sm text-slate-200">
          <li>✓ Everything in Pro</li>
          <li>✓ Advanced account management workflows</li>
          <li>✓ Dedicated onboarding and support</li>
        </ul>
        <button
          type="button"
          disabled={loadingPlan === "Enterprise"}
          onClick={() => handleCheckout(enterprisePriceId, "Enterprise")}
          className="mt-6 w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
        >
          {loadingPlan === "Enterprise" ? "Redirecting..." : "Choose Enterprise"}
        </button>
      </article>

      {error && (
        <div className="col-span-full rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
