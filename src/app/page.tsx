import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, BarChart3, Users, LayoutDashboard, Component, Globe, Lock } from "lucide-react";

export default function Home() {
  const features = [
    {
      name: "Authentication",
      description: "Secure, passwordless login and OAuth integration out of the box.",
      icon: Lock,
    },
    {
      name: "Billing & Subscriptions",
      description: "Flexible pricing models powered by Stripe with built-in customer portals.",
      icon: Component,
    },
    {
      name: "Team Workspaces",
      description: "Multi-tenant architecture allowing users to collaborate in isolated environments.",
      icon: Users,
    },
    {
      name: "Analytics Ready",
      description: "Built-in tracking and analytics to measure product adoption from day one.",
      icon: BarChart3,
    },
    {
      name: "Performance First",
      description: "Optimized for speed with Edge network delivery and modern React patterns.",
      icon: Zap,
    },
    {
      name: "Enterprise Security",
      description: "Bank-grade security, RBAC, and data compliance standards built-in.",
      icon: Shield,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 opacity-20 blur-[100px]" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-20 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <span className="relative flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-shadow hover:shadow-md">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
                Platfrmr Boilerplate 2.0 is here
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
              Ship your SaaS in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">days, not months.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
              The ultimate Next.js boilerplate with everything you need to build, launch, and scale your SaaS product. Authentication, billing, dashboards, and more—all out of the box.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signup"
                className="group flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:scale-105 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="text-sm font-semibold leading-6 text-slate-900 transition-colors hover:text-indigo-600"
              >
                Explore Features <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Focus on your product, we've got the rest
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Don't reinvent the wheel. Platfrmr provides a rock-solid foundation so you can spend your time building features your users actually care about.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col rounded-3xl bg-slate-50 p-8 ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center rounded-3xl bg-slate-900 px-6 py-16 sm:p-20 shadow-2xl ring-1 ring-white/10">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to launch your SaaS?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Join hundreds of founders who are shipping faster and smarter. Start building your next big idea today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signup"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-transform hover:scale-105 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start your free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="#" className="text-slate-400 hover:text-slate-500">
              <span className="sr-only">Twitter</span>
              <Globe className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-slate-500">
              <span className="sr-only">GitHub</span>
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-sm leading-5 text-slate-500">
              &copy; {new Date().getFullYear()} Platfrmr, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
