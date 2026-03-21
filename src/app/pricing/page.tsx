import { PricingCards } from "@/components/pricing/pricing-cards";

export default function PricingPage() {
  const basicPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC ?? "";
  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO ?? "";
  const enterprisePriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE ?? "";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Pricing</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Three plans for different stages of growth.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Starter begins at $19/mo, Pro begins at $39/mo, and Enterprise begins at $99/mo. Adapt the plan structure and Stripe prices to match your product model.
        </p>

        <div className="mt-8">
          <PricingCards 
            basicPriceId={basicPriceId}
            proPriceId={proPriceId}
            enterprisePriceId={enterprisePriceId}
          />
        </div>
      </section>
    </main>
  );
}
