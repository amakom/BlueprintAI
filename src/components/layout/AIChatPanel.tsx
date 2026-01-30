'use client';

import { Send, Sparkles, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import Link from 'next/link';

export function AIChatPanel() {
  const { limits, isLoading } = useSubscription();

  return (
    <div className="w-80 bg-white border-l border-border flex flex-col h-full shadow-lg">
      <div className="p-4 border-b border-border bg-cloud/50">
        <h2 className="font-bold text-navy flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan" />
            Blueprint AI
        </h2>
        <p className="text-xs text-gray-500 mt-1">
            Generate PRDs, user flows, and tickets.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-cloud p-3 rounded-lg rounded-tl-none text-sm text-navy">
            Hi! I can help you draft your Mobile App PRD. Try asking me to &quot;Generate user stories for login&quot;.
        </div>
      </div>

      <div className="p-4 border-t border-border">
        {!isLoading && !limits.canGenerateAI ? (
            <div className="text-center p-4 bg-cloud rounded-lg border border-dashed border-amber">
                <Lock className="w-5 h-5 text-amber mx-auto mb-2" />
                <h3 className="font-bold text-navy text-sm">AI Features Locked</h3>
                <p className="text-xs text-gray-500 mb-3">Upgrade to Pro to use Blueprint AI.</p>
                <Link href="/pricing" className="block w-full py-1.5 bg-navy text-white text-xs font-bold rounded hover:bg-navy/90">
                    Upgrade to Pro
                </Link>
            </div>
        ) : (
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Ask AI to generate…" 
                    className="w-full pl-3 pr-10 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan/20"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-navy hover:text-cyan">
                    <Send className="w-4 h-4" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
