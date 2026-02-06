'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/plans';
import { AlertModal } from '@/components/ui/AlertModal';
import { PricingPreview } from './PricingPreview';

interface PricingTableProps {
    initialTeamId?: string;
    initialUserEmail?: string;
    initialUserName?: string;
}

export function PricingTable({ initialTeamId, initialUserEmail, initialUserName }: PricingTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<'FREE' | 'PRO' | 'TEAM'>('FREE');

  // Use provided data or fall back to mock for demo
  const userEmail = initialUserEmail || 'demo@blueprint.ai';
  const userName = initialUserName || 'Demo User';
  const teamId = initialTeamId || 'cm6jdemo';

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    if (planId === 'PRO') setSelectedPreview('PRO');
    if (planId === 'TEAM') setSelectedPreview('TEAM');
    try {
      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            planId,
            currency: 'USD',
            teamId,
            userEmail,
            userName
        }),
      });
      const data = await res.json();
      if (data.link) {
        window.location.href = data.link;
      } else {
        setAlertMessage('Failed to initialize payment');
      }
    } catch (err) {
      console.error(err);
      setAlertMessage('Error connecting to billing service');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      ...SUBSCRIPTION_PLANS.FREE,
      priceDisplay: '$0',
      period: 'forever',
    },
    {
      ...SUBSCRIPTION_PLANS.PRO,
      priceDisplay: '$49',
      period: 'one-time',
      badge: 'BETA — 20 SPOTS',
      highlight: true,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-navy mb-4">Early Access — Limited Beta</h2>
        <p className="text-gray-500">Get lifetime Pro access for a one-time price. Only 20 spots available.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-md p-8 border ${plan.highlight ? 'border-cyan shadow-lg ring-1 ring-cyan' : 'border-border'}`}
            onMouseEnter={() => setSelectedPreview(plan.id as 'FREE' | 'PRO' | 'TEAM')}
            onFocus={() => setSelectedPreview(plan.id as 'FREE' | 'PRO' | 'TEAM')}
          >
            {(plan as any).badge && (
              <div className="absolute top-0 right-0 bg-cyan text-navy text-xs font-bold px-3 py-1 rounded-bl-md rounded-tr-md">
                {(plan as any).badge}
              </div>
            )}
            <h3 className="text-xl font-bold text-navy mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-navy">{plan.priceDisplay}</span>
              <span className="text-gray-500">{plan.period}</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-cyan shrink-0" />
                  <span className="text-navy/80 text-sm">{feat}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={!!loading || plan.price === 0}
              className={`w-full py-2.5 rounded-md font-bold transition-all flex items-center justify-center gap-2
                ${plan.highlight
                    ? 'bg-cyan text-navy hover:bg-cyan/90'
                    : 'bg-navy text-white hover:bg-navy/90'}
                ${loading === plan.id ? 'opacity-75 cursor-not-allowed' : ''}
              `}
            >
              {loading === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
              {plan.price === 0 ? 'Current Plan' : (loading === plan.id ? 'Processing...' : 'Get Lifetime Access')}
            </button>
          </div>
        ))}
      </div>
      
      <PricingPreview selected={selectedPreview} />

      <AlertModal
        isOpen={!!alertMessage}
        onClose={() => setAlertMessage(null)}
        message={alertMessage || ''}
        title="Payment Error"
      />
    </div>
  );
}
