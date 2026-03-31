"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { linkGitHubAccount } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SettingsContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const isGithubLinked = user.providerData.some(
    (provider) => provider.providerId === "github.com"
  );

  const handleLinkGitHub = async () => {
    setLinking(true);
    setError(null);
    try {
      await linkGitHubAccount();
    } catch (err: any) {
      setError(err.message || "Failed to link GitHub account");
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="container mx-auto p-4 py-10 max-w-xl">
      <h1 className="text-3xl border-b pb-4 mb-8 font-bold">Settings</h1>

      {error && (
        <div className="alert alert-error mb-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-xl border border-base-200 p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 break-words">Welcome, {user.displayName?.split(' ')[0] || "User"}</h2>
          <p className="text-sm opacity-70 mb-4">{user.email}</p>

          <div className="divider my-4"></div>

          <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold border-b pb-2">Subscription</p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-base-200/50 p-4 rounded-lg gap-4 border border-base-200">
              <div>
                <p className="text-sm font-medium text-base-content/70">Current Plan</p>
                <div className="flex flex-col items-start gap-1 mt-1 whitespace-nowrap">
                  <span className="badge badge-primary badge-lg whitespace-nowrap">Pro Active</span>
                  <span className="text-sm text-base-content/50">Renews Apr 28, 2026</span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={() => router.push("/upgrade")}
                  className="btn btn-sm btn-primary flex-1 sm:flex-none px-6"
                >
                  Upgrade
                </button>
                <button
                  onClick={() => router.push("/cancel")}
                  className="btn btn-sm btn-outline btn-error flex-1 sm:flex-none px-6"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="divider my-2"></div>
          
          <p className="text-lg font-semibold border-b pb-2 mb-2">Integrations</p>
          <button 
            onClick={handleLinkGitHub} 
            disabled={linking || isGithubLinked}
            className={`btn w-full sm:w-auto ${isGithubLinked ? 'btn-success text-success-content' : 'btn-outline'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            {linking ? "Linking..." : isGithubLinked ? "GitHub Linked" : "Link GitHub"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>}>
      <SettingsContent />
    </Suspense>
  );
}
