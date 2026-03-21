"use client";

import { PremiumFeature } from "@/components/premium/premium-feature";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <main className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">
          Welcome{profile?.displayName ? `, ${profile.displayName}` : ""}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This reusable shell is where product metrics, tasks, and insights can live.
        </p>
      </section>

      <PremiumFeature />
    </main>
  );
}
