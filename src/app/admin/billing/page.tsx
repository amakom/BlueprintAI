
'use client';

import { useEffect, useState } from 'react';
import { CreditCard, FileText, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  ref: string;
  teamName: string;
  createdAt: string;
}

interface Log {
  id: string;
  action: string;
  user?: { email: string };
  createdAt: string;
  metadata?: any;
}

export default function AdminBillingPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'logs'>('transactions');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'transactions') {
        const res = await fetch('/api/admin/billing/transactions');
        if (res.ok) {
          const data = await res.json();
          setInvoices(data.invoices);
        }
      } else {
        const res = await fetch('/api/admin/logs?type=billing');
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs);
        }
      }
    } catch (error) {
      console.error('Failed to fetch billing data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Billing Oversight
        </h1>
        <button 
            onClick={fetchData} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'transactions' 
              ? 'border-cyan text-cyan' 
              : 'border-transparent text-gray-500 hover:text-navy'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'logs' 
              ? 'border-cyan text-cyan' 
              : 'border-transparent text-gray-500 hover:text-navy'
          }`}
        >
          Webhook Logs
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-gray-500">Loading data...</div>
        ) : activeTab === 'transactions' ? (
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Team</th>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No transactions found</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        {inv.status === 'successful' || inv.status === 'paid' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" /> Paid
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {inv.status}
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-navy">
                        {inv.currency} {inv.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{inv.teamName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">{inv.ref}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
            <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Details</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No logs found</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-navy">{log.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{log.user?.email || 'System'}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-mono max-w-xs truncate">
                        {JSON.stringify(log.metadata)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
