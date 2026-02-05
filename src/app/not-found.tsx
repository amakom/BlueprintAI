import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 text-center">
      <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-90 transition-opacity">
        <Image src="/icon.svg" alt="BlueprintAI" width={40} height={40} className="rounded-md" />
        <span className="text-2xl font-bold text-white">BlueprintAI</span>
      </Link>

      <div className="relative mb-8">
        <div className="text-[150px] md:text-[200px] font-bold text-white/5 leading-none select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-cyan/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Page Not Found</h1>
      <p className="text-gray-400 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-cyan text-navy font-bold rounded-md hover:bg-white transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-white/10 text-white font-bold rounded-md hover:bg-white/20 transition-colors"
        >
          Go to Dashboard
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
