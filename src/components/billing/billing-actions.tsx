"use client";

import { useState } from "react";

import {
  createBillingPortalSession,
  createCheckoutSession,
} from "@/lib/billing-client";
import { useAuth } from "@/hooks/use-auth";

export function BillingActions() {
  const { profile } = useAuth();
  const [error, setError] = useState<string>("");
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  const onCheckout = async () => {
    try {
      setError("");
      setIsLoadingCheckout(true);
      const data = await createCheckoutSession();
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open checkout.");
      setIsLoadingCheckout(false);
    }
  };

  const onPortal = async () => {
    try {
      setError("");
      setIsLoadingPortal(true);
      const data = await createBillingPortalSession();
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open portal.");
      setIsLoadingPortal(false);
    }
  };

  const isPremium = profile?.subscriptionStatus === "active" || profile?.subscriptionStatus === "trialing";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Billing actions</h2>
      <p className="mt-1 text-sm text-slate-600">
        Current status: <span className="font-semibold">{profile?.subscriptionStatus ?? "free"}</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {!isPremium ? (
          <button
            type="button"
            onClick={onCheckout}
            disabled={isLoadingCheckout}
            className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
          >
            {isLoadingCheckout ? "Opening checkout..." : "Upgrade to Pro"}
          </button>
        ) : null}

        <button
          type="button"
          onClick={onPortal}
          disabled={isLoadingPortal}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-60"
        >
          {isLoadingPortal ? "Opening portal..." : "Manage Billing"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
    </div>
  );
}
