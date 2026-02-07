'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Users,
  UserMinus,
  Trash2,
  Loader2,
  Check,
  Search,
  ChevronDown,
  Clock
} from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  source: string;
  status: string;
  subscribedAt: string;
}

interface Campaign {
  id: string;
  subject: string;
  sentAt: string;
  recipientCount: number;
  status: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Compose state
  const [showCompose, setShowCompose] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
  }, [filter]);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`/api/admin/subscribers?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/newsletter');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns);
      }
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber permanently?')) return;
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubscribers(prev => prev.filter(s => s.id !== id));
        setStats(prev => ({ ...prev, total: prev.total - 1, active: prev.active - 1 }));
      }
    } catch (err) {
      console.error('Failed to delete subscriber:', err);
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) return;

    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();

      if (res.ok) {
        setSendResult(data.message);
        setSubject('');
        setBody('');
        fetchCampaigns();
        setTimeout(() => {
          setShowCompose(false);
          setSendResult(null);
        }, 3000);
      } else {
        setSendResult(data.error || 'Failed to send');
      }
    } catch (err) {
      setSendResult('Network error');
    } finally {
      setSending(false);
    }
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Newsletter & Subscribers</h1>
          <p className="text-gray-500">Manage your mailing list and send updates to subscribers</p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-medium"
        >
          <Send className="w-4 h-4" />
          Compose Email
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Subscribers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.active}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <UserMinus className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.unsubscribed}</p>
              <p className="text-sm text-gray-500">Unsubscribed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Send className="w-5 h-5" /> Compose Newsletter
          </h2>
          <form onSubmit={handleSendNewsletter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., BlueprintAI Beta Update — New Features!"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan text-navy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body (plain text — will be formatted automatically)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email content here. Use line breaks for paragraphs."
                required
                rows={8}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan text-navy resize-y"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Will be sent to <strong>{stats.active}</strong> active subscriber{stats.active !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-gray-500 hover:text-navy transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || !subject || !body}
                  className="flex items-center gap-2 px-6 py-2 bg-cyan text-navy font-bold rounded-lg hover:bg-cyan/90 transition-colors disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? 'Sending...' : 'Send Newsletter'}
                </button>
              </div>
            </div>
            {sendResult && (
              <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                sendResult.includes('sent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <Check className="w-4 h-4" />
                {sendResult}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Subscriber List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-navy">Subscribers</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-md px-2 py-1 text-gray-600 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-1.5 text-sm border border-gray-200 rounded-md text-navy focus:outline-none focus:ring-2 focus:ring-cyan/50"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-cyan" />
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Mail className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No subscribers yet</p>
            <p className="text-sm mt-1">Subscribers will appear here when people sign up from the landing page.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Source</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-navy font-medium">{sub.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{sub.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {sub.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      sub.status === 'active'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Past Campaigns */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-navy">Past Campaigns</h2>
        </div>
        {campaigns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-6 h-6 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No campaigns sent yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Sent</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Recipients</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-navy font-medium">{c.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(c.sentAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.recipientCount}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
