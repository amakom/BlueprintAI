'use client';

import { useEffect, useState } from 'react';
import { Loader2, FileText, Search } from 'lucide-react';

export default function AdminBillingPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = () => {
    setLoading(true);
    fetch(`/api/admin/logs?type=${filter}`)
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs || []);
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">System Logs & Billing</h1>
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {['all', 'auth', 'billing'].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        filter === f ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-slate-900'
                    }`}
                >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
            <div className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No logs found.</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${
                                        log.resource === 'billing' ? 'bg-green-500' : 
                                        log.resource === 'auth' ? 'bg-blue-500' : 'bg-gray-400'
                                    }`} />
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {log.action.replace('_', ' ').toUpperCase()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {log.user?.email || 'Unknown User'} • {log.ipAddress || 'No IP'}
                                        </p>
                                        {log.metadata && (
                                            <pre className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-100 overflow-x-auto max-w-xl text-slate-600">
                                                {JSON.stringify(log.metadata, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(log.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
      </div>
    </div>
  );
}
