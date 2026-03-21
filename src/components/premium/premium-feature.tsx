"use client";

import Link from "next/link";

import { useAuth } from "@/hooks/use-auth";

export function PremiumFeature() {
  const { isPremium } = useAuth();

  if (!isPremium) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-700">
          Premium Feature
        </p>
        <h3 className="mt-2 text-lg font-semibold text-amber-950">
          Advanced AI insights are locked on the free plan.
        </h3>
        <p className="mt-2 text-sm text-amber-800">
          Upgrade to unlock usage analytics, forecasting, and priority support.
        </p>
        <Link
          href="/pricing"
          className="mt-4 inline-flex rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
        >
          View plans
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-700">
        Premium Feature
      </p>
      <h3 className="mt-2 text-lg font-semibold text-emerald-950">
        AI Revenue Projection
      </h3>
      <p className="mt-2 text-sm text-emerald-900">
        Your model predicts a 17.4% MRR increase over the next 30 days.
      </p>
    </div>
  );
}
