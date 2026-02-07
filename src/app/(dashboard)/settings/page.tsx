'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Settings</h1>

      <div className="bg-white p-6 rounded-md border border-border max-w-2xl">
        <h2 className="text-xl font-bold text-navy mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Display Name</label>
            <input
              type="text"
              className="w-full p-2 border border-border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-border rounded-md bg-gray-50"
              value={user?.email || ''}
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Role</label>
            <input
              type="text"
              className="w-full p-2 border border-border rounded-md bg-gray-50"
              value={user?.role || 'USER'}
              disabled
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-navy text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-navy/90 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
