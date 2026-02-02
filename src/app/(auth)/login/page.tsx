'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-border w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-cyan rounded-md flex items-center justify-center text-navy text-lg font-bold">
              B
            </div>
            <span className="text-xl font-bold text-navy">BlueprintAI</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-navy mb-6 text-center">Welcome Back</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-2 border border-border rounded-md"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-2 border border-border rounded-md"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-navy text-white py-2 rounded-md font-bold hover:bg-navy/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don&#39;t have an account? <Link href="/signup" className="text-cyan font-bold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
