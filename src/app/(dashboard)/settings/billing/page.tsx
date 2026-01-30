'use client';

import { useEffect, useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import Link from 'next/link';

export default function BillingSettingsPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mockTeamId = 'cm6jdemo';

  useEffect(() => {
    fetch(`/api/billing/status?teamId=${mockTeamId}`)
      .then(res => res.json())
      .then(data => {
        setSubscription(data.subscription);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-navy">Loading billing info...</div>;

  const isProOrTeam = subscription && subscription.status === 'ACTIVE' && subscription.plan !== 'FREE';

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-navy mb-8">Billing & Subscription</h1>

      {/* Current Plan Card */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-navy mb-1">Current Plan</h2>
            <p className="text-gray-500">
              You are currently on the <span className="font-bold text-cyan capitalize">{subscription?.plan || 'Free'}</span> plan.
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            subscription?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {subscription?.status || 'Active'}
          </span>
        </div>

        {!isProOrTeam ? (
           <div className="bg-cloud p-4 rounded-lg flex items-center justify-between">
             <div className="flex items-center gap-3">
               <AlertTriangle className="w-5 h-5 text-amber" />
               <span className="text-navy text-sm">Upgrade to unlock AI features and unlimited projects.</span>
             </div>
             <Link href="/pricing" className="px-4 py-2 bg-navy text-white rounded-md text-sm font-bold hover:bg-navy/90">
               Upgrade Now
             </Link>
           </div>
        ) : (
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-cloud rounded-lg">
                    <span className="text-xs text-gray-500 block mb-1">Billing Period</span>
                    <span className="text-navy font-bold">Monthly</span>
                </div>
                <div className="p-4 bg-cloud rounded-lg">
                    <span className="text-xs text-gray-500 block mb-1">Next Payment</span>
                    <span className="text-navy font-bold">
                        {subscription?.currentPeriodEnd 
                            ? new Date(subscription.currentPeriodEnd).toLocaleDateString() 
                            : 'N/A'}
                    </span>
                </div>
            </div>
        )}
      </div>

      {/* Invoices */}
      {subscription?.invoices?.length > 0 && (
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Invoice History
            </h2>
            <div className="space-y-2">
                {subscription.invoices.map((inv: any) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 hover:bg-cloud rounded-lg transition-colors border border-transparent hover:border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-navy">
                                    {inv.currency} {inv.amount.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {new Date(inv.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-navy">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
}
