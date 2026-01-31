'use client';

import { Activity, BarChart3 } from 'lucide-react';

export default function AdminAIPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">AI Usage Monitoring</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Real-time Usage Tracking</h2>
        <p className="text-gray-500 max-w-md mx-auto">
            AI usage logs are being collected. Detailed analytics and per-user quota management will appear here.
        </p>
      </div>
    </div>
  );
}
