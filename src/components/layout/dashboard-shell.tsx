"use client";

import type { ReactNode } from "react";

import { useAuth } from "@/hooks/use-auth";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { profile } = useAuth();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
      <aside className="w-full rounded-2xl border border-slate-200 bg-white p-4 lg:w-64">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>
        <p className="mt-2 truncate text-sm font-medium text-slate-800">
          {profile?.email ?? "Loading..."}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Plan: <span className="font-semibold">{profile?.subscriptionStatus ?? "free"}</span>
        </p>
      </aside>

      <section className="flex-1">{children}</section>
    </div>
  );
}
