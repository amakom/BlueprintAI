import Link from 'next/link';
import { Testimonials } from '@/components/landing/Testimonials';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy text-white selection:bg-cyan selection:text-navy">
      {/* Grid Lines and Dots Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #334155 2px, transparent 0),
            linear-gradient(to right, #334155 1px, transparent 1px),
            linear-gradient(to bottom, #334155 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' // Subtle fade out at bottom for polish
        }}
      />
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-cyan rounded-md flex items-center justify-center text-navy text-lg font-bold">
            B
          </div>
          BlueprintAI
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
          <Link href="/dashboard" className="bg-cyan text-navy px-5 py-2 rounded-full font-bold hover:bg-white transition-colors">Get Started</Link>
        </div>
      </nav>

      <main className="px-6 relative z-10">
        <section className="container mx-auto pt-20 pb-24 text-center">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20">Collaborate with Intelligence</p>
          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold leading-tight">
            Ship Faster with <span className="text-cyan">BlueprintAI</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">From idea to launch, BlueprintAI integrates AI into your entire product workflow so you can design, plan, and deliver at full speed.</p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/dashboard" className="bg-cyan text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all">Start Free</Link>
            <Link href="/pricing" className="border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:border-white transition-all">See Plans</Link>
          </div>
        </section>

        <section className="container mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="text-cyan text-sm font-bold">From Canvas to Specs</div>
            <h3 className="mt-2 text-2xl font-bold">Visual-first PRDs</h3>
            <p className="mt-3 text-gray-400">Design flows and requirements on an infinite canvas, then export clean developer-ready specs.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="text-cyan text-sm font-bold">AI Everywhere</div>
            <h3 className="mt-2 text-2xl font-bold">Generate and refine</h3>
            <p className="mt-3 text-gray-400">Use AI to create user stories, edge cases, and acceptance criteria, tailored to your project.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="text-cyan text-sm font-bold">Team Speed</div>
            <h3 className="mt-2 text-2xl font-bold">Real-time collaboration</h3>
            <p className="mt-3 text-gray-400">Work with your team live, review changes, and ship faster with shared context.</p>
          </div>
        </section>

        <section className="mt-20 text-center overflow-hidden">
          <div className="container mx-auto px-6 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <span className="text-xs font-bold text-gray-300">Loved by builders</span>
            </div>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">BlueprintAI brings a responsive, refined experience that helps teams deliver with confidence.</p>
          </div>
          <Testimonials />
        </section>
      </main>

      <footer className="mt-24 border-t border-white/10 relative z-10">
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="text-6xl md:text-8xl font-extrabold tracking-tight">BlueprintAI</div>
          <p className="mt-6 text-sm text-gray-500">© 2025 BlueprintAI</p>
        </div>
      </footer>
    </div>
  );
}
