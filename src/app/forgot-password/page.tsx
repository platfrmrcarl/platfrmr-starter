"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      setMessage("");
      await resetPassword(email);
      setMessage("Password reset email sent. Check your inbox.");
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-6xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:max-w-md">
        <h1 className="text-2xl font-semibold text-slate-900">Forgot password</h1>
        <p className="mt-1 text-sm text-slate-600">Enter your email and we will send a reset link.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}

        <p className="mt-4 text-sm text-slate-600">
          Back to{" "}
          <Link href="/login" className="text-cyan-700 hover:text-cyan-600">
            login
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
