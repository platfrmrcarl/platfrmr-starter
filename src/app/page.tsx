import Link from "next/link";

export default function Home() {
  const modules = [
    { name: "Auth & Identity", role: "Email, OAuth, secure sessions", initials: "AU" },
    { name: "Billing Engine", role: "Stripe plans, checkout, portal", initials: "BI" },
    { name: "Team Workspace", role: "Organizations, members, roles", initials: "TW" },
    { name: "Product Analytics", role: "Funnels, retention, activation", initials: "PA" },
    { name: "Launch Toolkit", role: "Emails, onboarding, templates", initials: "LT" },
  ];

  const roadmap = [
    { date: "STEP 01", title: "Pick Your Core Template", speakers: "Start with B2B SaaS, marketplace, or AI wrapper" },
    { date: "STEP 02", title: "Ship Payments and Access", speakers: "Enable subscriptions, trials, and feature gates" },
    { date: "STEP 03", title: "Scale with Real Data", speakers: "Track activation, churn, and expansion from day one" },
  ];

  return (
    <main className="relative overflow-hidden pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_6%,rgba(200,231,255,0.8),transparent_30%),radial-gradient(circle_at_90%_14%,rgba(255,232,238,0.85),transparent_30%),linear-gradient(to_bottom,#f8fbff,#f5f8ff_45%,#fbfdff)]" />

      <section id="home" className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-700">Build and launch in weeks</p>
          <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight text-slate-950 sm:text-6xl">
            SaaS Platform for Building SaaS Products
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
            Ship production-ready SaaS apps with authentication, subscriptions, multi-tenant data models,
            and a polished dashboard without reinventing your stack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              Start building
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Try demo account
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="aspect-[4/3] rounded-[1.4rem] bg-[linear-gradient(140deg,#06224a,#0f4ea0_45%,#5fa8ff)] p-6 text-white">
              <p className="text-xs uppercase tracking-[0.22em] text-sky-200">Featured Build Path</p>
              <h2 className="mt-5 text-2xl font-semibold">From Idea to Paid SaaS in One Stack</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-sky-100">
                Launch sign-up, onboarding, paywalls, and account controls with battle-tested components
                and backend wiring.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm text-sky-100">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">7d</span>
                <span>Average MVP setup • Full billing flow</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Shipping Velocity</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">3x faster launches</p>
          </div>
        </div>
      </section>

      <section id="about" className="relative mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Platform Overview</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Everything You Need to Build a Real SaaS</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Move from prototype to production with opinionated defaults for auth, payments, and customer
          lifecycle flows. Build your product logic on top of stable infrastructure.
        </p>
      </section>

      <section id="features" className="relative mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Core Platform Modules</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Built-In Features for SaaS Teams</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {modules.map((module) => (
            <article key={module.name} className="rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[linear-gradient(145deg,#0b2d64,#2d7dd9)] text-2xl font-bold text-white">
                {module.initials}
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{module.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{module.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="blueprint" className="relative mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_1.1fr] lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Plans for Every Stage</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Scale from First User to Revenue Engine</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Choose the path that matches your stage: bootstrap quickly, validate demand, then expand with
              automation, analytics, and team workflows.
            </p>
            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-sm text-slate-600">Starter</span>
                <span className="text-xl font-bold text-slate-900">$49</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Growth</span>
                <span className="text-xl font-bold text-slate-900">$149</span>
              </div>
            </div>
            <Link
              href="/pricing"
              className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View all plans
            </Link>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Build Blueprint</h3>
            {roadmap.map((session) => (
              <article key={session.date} className="rounded-2xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50/40">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">{session.date}</p>
                <h4 className="mt-2 text-lg font-semibold text-slate-900">{session.title}</h4>
                <p className="mt-1 text-sm text-slate-600">{session.speakers}</p>
                <Link href="/pricing" className="mt-3 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-600">
                  Learn More
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="results" className="relative mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <h3 className="text-2xl font-bold text-slate-950">Platform Results</h3>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Founders and product teams use this platform to accelerate launches, increase conversion,
          and keep infrastructure debt under control.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-4xl font-bold text-slate-900">2.8x</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">Faster MVP Delivery</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-4xl font-bold text-slate-900">38%</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">Activation Lift</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-4xl font-bold text-slate-900">$4.2M+</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">ARR Processed</p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <div className="rounded-[2rem] bg-[linear-gradient(125deg,#051a3d,#0a3472_52%,#2d7dd9)] p-7 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">Founder Stories</p>
          <h3 className="mt-3 text-3xl font-bold">What SaaS Teams Say</h3>
          <p className="mt-4 max-w-3xl text-base leading-7 text-sky-100">
            We replaced months of backend and billing work with a weekend setup. Our team focused on product
            differentiation while the platform handled authentication, plans, and account lifecycle.
          </p>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">Arielle Kim, Founder at FlowDesk</p>
        </div>
      </section>

      <section className="relative mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
          <h3 className="text-3xl font-bold text-slate-950 sm:text-4xl">Build Your SaaS Product on a Proven Foundation</h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Skip boilerplate debt and go live with authentication, subscriptions, user management,
            and a production-ready dashboard.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500"
            >
              Start free trial
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Explore dashboard
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative mx-auto mt-20 w-full max-w-6xl border-t border-slate-200 px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-semibold text-slate-900">SaaS Platform</p>
            <p className="mt-2 text-sm text-slate-600">All rights reserved. Built for teams building SaaS products.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
            <Link href="#home" className="hover:text-slate-900">Home</Link>
            <Link href="#features" className="hover:text-slate-900">Features</Link>
            <Link href="#blueprint" className="hover:text-slate-900">Blueprint</Link>
            <Link href="#results" className="hover:text-slate-900">Results</Link>
            <Link href="#about" className="hover:text-slate-900">About</Link>
            <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
