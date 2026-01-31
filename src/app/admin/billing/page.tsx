
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

interface WebhookLog {
  id: string;
  provider: string;
  eventType: string | null;
  status: string;
  error: string | null;
  payload: any;
  createdAt: string;
}

export default function AdminBillingPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'webhooks'>('transactions');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Grant Plan State
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantTeamId, setGrantTeamId] = useState('');
  const [grantPlan, setGrantPlan] = useState('PRO');
  const [grantStatus, setGrantStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
        const res = await fetch('/api/admin/billing/webhooks');
        if (res.ok) {
          const data = await res.json();
          setWebhookLogs(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch billing data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrantStatus('loading');
    try {
        const res = await fetch('/api/admin/billing/grant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamId: grantTeamId, plan: grantPlan })
        });
        
        if (res.ok) {
            setGrantStatus('success');
            setTimeout(() => {
                setShowGrantModal(false);
                setGrantStatus('idle');
                setGrantTeamId('');
            }, 2000);
        } else {
            setGrantStatus('error');
        }
    } catch (err) {
        setGrantStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Billing Oversight
        </h1>
        <div className="flex gap-2">
            <button
                onClick={() => setShowGrantModal(true)}
                className="px-4 py-2 bg-navy text-white text-sm rounded-lg hover:bg-navy/90 transition-colors"
            >
                Grant Plan
            </button>
            <button 
                onClick={fetchData} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Refresh"
            >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      {/* Grant Plan Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-lg font-bold text-navy mb-4">Manually Grant Plan</h2>
                <form onSubmit={handleGrantPlan} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team ID</label>
                        <input 
                            type="text" 
                            required
                            value={grantTeamId}
                            onChange={(e) => setGrantTeamId(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-cyan focus:border-cyan"
                            placeholder="cl..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                        <select 
                            value={grantPlan}
                            onChange={(e) => setGrantPlan(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-cyan focus:border-cyan"
                        >
                            <option value="PRO">Pro</option>
                            <option value="TEAM">Team</option>
                            <option value="ENTERPRISE">Enterprise</option>
                        </select>
                    </div>
                    
                    {grantStatus === 'success' && <p className="text-green-600 text-sm">Plan granted successfully!</p>}
                    {grantStatus === 'error' && <p className="text-red-600 text-sm">Failed to grant plan. Check Team ID.</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <button 
                            type="button"
                            onClick={() => setShowGrantModal(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={grantStatus === 'loading'}
                            className="px-4 py-2 bg-cyan text-navy font-medium rounded-md hover:bg-cyan/90 disabled:opacity-50"
                        >
                            {grantStatus === 'loading' ? 'Granting...' : 'Grant Access'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

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
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'webhooks' 
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
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Provider / Event</th>
                <th className="px-6 py-3">Payload</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {webhookLogs.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No webhook logs found</td></tr>
              ) : (
                webhookLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {log.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-navy">{log.provider}</div>
                        <div className="text-xs text-gray-500">{log.eventType || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-mono max-w-xs truncate" title={JSON.stringify(log.payload, null, 2)}>
                        {JSON.stringify(log.payload)}
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
