import PricingTable from "@/components/PricingTable";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-primary">Pricing</h1>
        <p className="text-xl mb-12">Simple, transparent pricing for everyone.</p>
        
        <PricingTable />
      </div>
    </div>
  );
}
