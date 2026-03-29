"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import Link from "next/link";

function CancelContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-full mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-20 flex justify-center">
      <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-lg p-8">
        <div className="card-body gap-6 px-0 md:px-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold">Subscription Cancelled</h1>
          
          <p className="text-base-content/80 mt-2">
            We're sorry to see you go! Your Pro subscription has been successfully cancelled. 
          </p>

          <div className="bg-base-200 p-4 rounded-lg my-2">
            <p className="font-medium">
              You can continue to use the Pro service until the end of your billing cycle on <span className="font-bold text-primary">April 28, 2026</span>.
            </p>
          </div>

          <p className="text-sm text-base-content/60 mb-4">
            If you change your mind, you can always resubscribe from your settings page.
          </p>

          <Link href="/app" className="btn btn-primary w-full mt-2">
           Go back Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>}>
      <CancelContent />
    </Suspense>
  );
}
