"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { signIn, signInGoogle } = useAuth();
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/dashboard");
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      await signIn(email, password);
      router.push(nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setIsLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signInGoogle();
      router.push(nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-6xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:max-w-md">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to access your dashboard.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
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
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
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

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-cyan-700 hover:text-cyan-600">
            Forgot password?
          </Link>
          <Link href="/signup" className="text-cyan-700 hover:text-cyan-600">
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
