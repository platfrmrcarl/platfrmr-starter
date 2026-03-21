"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/hooks/use-auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?next=${next}`);
    }
  }, [isLoading, pathname, router, user]);

  if (isLoading || !user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
        Loading your workspace...
      </div>
    );
  }

  return <>{children}</>;
}
