import { BillingActions } from "@/components/billing/billing-actions";

export default function BillingPage() {
  return (
    <main className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-950">Billing</h1>
        <p className="mt-1 text-sm text-slate-600">
          Start a subscription, update cards, and cancel through Stripe Billing Portal.
        </p>
      </section>

      <BillingActions />
    </main>
  );
}
