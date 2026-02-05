'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 text-center">
      <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-90 transition-opacity">
        <Image src="/icon.svg" alt="BlueprintAI" width={40} height={40} className="rounded-md" />
        <span className="text-2xl font-bold text-white">BlueprintAI</span>
      </Link>

      <div className="relative mb-8">
        <div className="text-[150px] md:text-[200px] font-bold text-white/5 leading-none select-none">500</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Something went wrong</h1>
      <p className="text-gray-400 max-w-md mb-8">
        We encountered an unexpected error. Our team has been notified and is working to fix it.
        Please try again or contact support if the problem persists.
      </p>

      {error.digest && (
        <p className="text-xs text-gray-500 mb-6 font-mono">
          Error ID: {error.digest}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-cyan text-navy font-bold rounded-md hover:bg-white transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white/10 text-white font-bold rounded-md hover:bg-white/20 transition-colors"
        >
          Go Home
        </Link>
      </div>

      <div className="mt-16 text-sm text-gray-500">
        Need help?{' '}
        <a href="mailto:support@blueprintai.dev" className="text-cyan hover:underline">
          Contact Support
        </a>
      </div>
    </div>
  );
}
