import { PricingTable } from '@/features/billing/PricingTable';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-cloud">
      <header className="bg-white border-b border-border py-4 px-6">
        <h1 className="text-xl font-bold text-navy">BlueprintAI</h1>
      </header>
      <main>
        <PricingTable />
      </main>
    </div>
  );
}
