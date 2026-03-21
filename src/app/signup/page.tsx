"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";

export default function SignupPage() {
  const { signUp, signInGoogle } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      await signUp(email, password, displayName);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
      setIsLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signInGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-up failed.");
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-6xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:max-w-md">
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600">Launch your SaaS with authentication and billing built in.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            type="text"
            placeholder="Full name"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            type="password"
            placeholder="Password (min 6 chars)"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={onGoogle}
          disabled={isLoading}
          className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-60"
        >
          Continue with Google
        </button>

        {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}

        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-700 hover:text-cyan-600">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
