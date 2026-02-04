'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const passwordValid = formData.password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud p-4">
      <div className="bg-white p-6 md:p-8 rounded-md shadow-sm border border-border w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-cyan rounded-md flex items-center justify-center text-navy text-lg font-bold">
              B
            </div>
            <span className="text-xl font-bold text-navy">BlueprintAI</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-navy mb-6 text-center">Create Account</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full p-2 border border-border rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
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
              minLength={8}
              className="w-full p-2 border border-border rounded-md"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {formData.password.length > 0 && (
              <p className={`text-xs mt-1 ${passwordValid ? 'text-green-600' : 'text-gray-400'}`}>
                {passwordValid ? 'Password strength: Good' : `${8 - formData.password.length} more characters needed`}
              </p>
            )}
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan text-navy py-2 rounded-md font-bold hover:bg-cyan/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-navy font-bold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
