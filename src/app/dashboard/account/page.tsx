"use client";

import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { useAuth } from "@/hooks/use-auth";
import { auth, db } from "@/lib/firebase/client";

export default function AccountPage() {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    try {
      setError("");
      setMessage("");
      setIsLoading(true);

      await updateProfile(auth.currentUser!, { displayName });
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setMessage("Account updated.");
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update account.");
      setIsLoading(false);
    }
  };

  return (
    <main className="rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold text-slate-950">Account settings</h1>
      <p className="mt-1 text-sm text-slate-600">Manage profile details and identity data.</p>

      <form onSubmit={onSave} className="mt-5 max-w-md space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={profile?.email ?? ""}
            disabled
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isLoading ? "Saving..." : "Save changes"}
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
    </main>
  );
}
