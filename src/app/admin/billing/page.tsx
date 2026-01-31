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
  userEmail: string;
  plan: string;
  date: string;
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
          setInvoices(data.invoices || []);
        }
      } else {
        const res = await fetch('/api/admin/billing/webhooks');
        if (res.ok) {
          const data = await res.json();
          setWebhookLogs(data || []);
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
          Payments
        </h1>
        <div className="flex gap-2">
            <button
                onClick={() => setShowGrantModal(true)}
                className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy/90"
            >
                Grant Plan
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
          <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'transactions' 
                      ? 'border-navy text-navy' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
              Transactions
          </button>
          <button
              onClick={() => setActiveTab('webhooks')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'webhooks' 
                      ? 'border-navy text-navy' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
              Webhook Logs
          </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === 'transactions' ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">User</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Amount</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Plan</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                             <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading payments...</td></tr>
                        ) : invoices.length === 0 ? (
                             <tr><td colSpan={5} className="p-6 text-center text-gray-500">No payments found</td></tr>
                        ) : (
                            invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-navy">{inv.userEmail}</div>
                                        <div className="text-xs text-gray-400">{inv.teamName}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-medium text-gray-700">
                                        {inv.currency} {inv.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 uppercase">
                                            {inv.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {new Date(inv.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                            inv.status === 'successful' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {inv.status === 'successful' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {inv.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Timestamp</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Provider</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Event</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                         {loading ? (
                             <tr><td colSpan={4} className="p-6 text-center text-gray-500">Loading logs...</td></tr>
                        ) : webhookLogs.length === 0 ? (
                             <tr><td colSpan={4} className="p-6 text-center text-gray-500">No logs found</td></tr>
                        ) : (
                            webhookLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-navy">{log.provider}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                            log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                        {log.eventType || 'N/A'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* Grant Plan Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-bold text-navy mb-4">Grant Plan Manually</h3>
                <form onSubmit={handleGrantPlan} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team ID</label>
                        <input 
                            type="text" 
                            required
                            value={grantTeamId}
                            onChange={(e) => setGrantTeamId(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-navy/20 outline-none"
                            placeholder="cl..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                        <select 
                            value={grantPlan}
                            onChange={(e) => setGrantPlan(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-navy/20 outline-none"
                        >
                            <option value="PRO">PRO</option>
                            <option value="TEAM">TEAM</option>
                            <option value="ENTERPRISE">ENTERPRISE</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button 
                            type="button"
                            onClick={() => setShowGrantModal(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={grantStatus === 'loading'}
                            className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 disabled:opacity-50"
                        >
                            {grantStatus === 'loading' ? 'Granting...' : 'Grant Plan'}
                        </button>
                    </div>
                    {grantStatus === 'success' && <p className="text-green-600 text-sm text-center">Plan granted successfully!</p>}
                    {grantStatus === 'error' && <p className="text-red-600 text-sm text-center">Failed to grant plan.</p>}
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
