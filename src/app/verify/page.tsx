
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    // Call API
    fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong.');
      });
  }, [token, email]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cloud">
        <Loader2 className="w-12 h-12 text-cyan animate-spin mb-4" />
        <h1 className="text-xl font-semibold text-navy">Verifying your email...</h1>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cloud p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-6">Your email has been successfully verified. You can now access all features.</p>
          <Link 
            href="/login" 
            className="inline-block w-full bg-navy text-white py-2 px-4 rounded-md font-medium hover:bg-opacity-90 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cloud p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-navy mb-2">Verification Failed</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link 
          href="/login" 
          className="text-cyan hover:underline font-medium"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
