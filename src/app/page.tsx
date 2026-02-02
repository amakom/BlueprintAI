import Link from 'next/link';
import { Testimonials } from '@/components/landing/Testimonials';
import { HeroSection } from '@/components/landing/HeroSection';
import { StrategyThinkingAnimation } from '@/components/landing/StrategyThinkingAnimation';
import { CanvasFlowAnimation } from '@/components/landing/CanvasFlowAnimation';
import { SpecConversionAnimation } from '@/components/landing/SpecConversionAnimation';
import { FinalCTAAnimation } from '@/components/landing/FinalCTAAnimation';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy text-white selection:bg-cyan selection:text-navy font-sans">
      {/* Grid Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
        }}
      />

      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
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

      <main className="relative z-10">
        {/* 🔵 HERO SECTION */}
        <HeroSection />

        {/* 🔵 PROBLEM SECTION */}
        <section className="container mx-auto px-6 py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-12">
              Building software fails at the planning stage — <span className="text-red-400">not the code.</span>
            </h2>
            
            <div className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10 text-left">
              <p className="text-xl text-gray-300 mb-8 font-medium">Most products break down before development even starts.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✕</span>
                  <span className="text-gray-300 text-lg">Founders struggle to translate ideas into technical requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✕</span>
                  <span className="text-gray-300 text-lg">Product managers spend weeks writing documents that go out of sync</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✕</span>
                  <span className="text-gray-300 text-lg">Developers receive vague specs and fill in the gaps themselves</span>
                </li>
              </ul>
              
              <div className="p-6 bg-navy/50 rounded-2xl border border-white/5 text-center">
                <p className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-2">The Result?</p>
                <p className="text-2xl font-bold text-white">Misalignment, wasted time, rework, and slow shipping.</p>
              </div>
            </div>

            <p className="mt-12 text-2xl font-bold text-cyan">
              BlueprintAI fixes the translation layer between idea, design, and code.
            </p>
          </div>
        </section>

        {/* 🔵 SOLUTION SECTION */}
        <section className="bg-white/5 border-y border-white/5">
          <div className="container mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  One system that thinks like a product manager and delivers like an engineer.
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  BlueprintAI acts as an <strong className="text-white">autonomous product realization engine</strong>. 
                  It connects <strong className="text-white">strategy, visuals, and technical specs</strong> into one living system — generated intelligently by AI.
                </p>
              </div>
              <div className="bg-navy/50 p-8 rounded-3xl border border-white/10">
                <h3 className="text-cyan font-bold mb-6 text-lg">Key Outcomes</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center text-cyan shrink-0">1</div>
                    <span className="text-lg text-gray-200">Go from idea to structured product plan in minutes</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center text-cyan shrink-0">2</div>
                    <span className="text-lg text-gray-200">Visualize flows instead of guessing requirements</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center text-cyan shrink-0">3</div>
                    <span className="text-lg text-gray-200">Hand developers specs they can actually build from</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 🔵 HOW IT WORKS (3-STEP FLOW) */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
            <p className="mt-4 text-gray-400">From concept to code in 3 steps</p>
          </div>

          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
            <div className="order-2 md:order-1">
              <StrategyThinkingAnimation />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block px-3 py-1 bg-cyan/10 text-cyan text-sm font-bold rounded-full mb-4">Step 1 — Strategic Intelligence</div>
              <h3 className="text-3xl font-bold mb-4">Describe your idea in plain language.</h3>
              <p className="text-gray-300 mb-6 text-lg">BlueprintAI generates:</p>
              <ul className="space-y-2 mb-8 text-gray-300">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan rounded-full"></span> User personas</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan rounded-full"></span> Business goals (OKRs & KPIs)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan rounded-full"></span> Competitive insights</li>
              </ul>
              <blockquote className="border-l-4 border-cyan pl-4 text-gray-400 italic">
                You start with clarity, not assumptions.
              </blockquote>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
            <div>
              <div className="inline-block px-3 py-1 bg-cyan/10 text-cyan text-sm font-bold rounded-full mb-4">Step 2 — Visual Architecture</div>
              <h3 className="text-3xl font-bold mb-4">Design your product on a smart canvas.</h3>
              <p className="text-gray-300 mb-6 text-lg">Using an interactive visual board:</p>
              <ul className="space-y-2 mb-8 text-gray-300">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan rounded-full"></span> AI draws user flows and screens</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan rounded-full"></span> You edit, move, and refine visually</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan rounded-full"></span> Each node understands product logic</li>
              </ul>
              <blockquote className="border-l-4 border-cyan pl-4 text-gray-400 italic">
                Think Figma + Miro — but aware of software concepts.
              </blockquote>
            </div>
            <div>
              <CanvasFlowAnimation />
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <SpecConversionAnimation />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block px-3 py-1 bg-cyan/10 text-cyan text-sm font-bold rounded-full mb-4">Step 3 — Technical Handoff</div>
              <h3 className="text-3xl font-bold mb-4">One-click Engineering Specification.</h3>
              <p className="text-gray-300 mb-6 text-lg">BlueprintAI reads your strategy and flows and produces:</p>
              <ul className="space-y-2 mb-8 text-gray-300">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan rounded-full"></span> Database schemas</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan rounded-full"></span> API endpoints</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan rounded-full"></span> Frontend component breakdowns</li>
              </ul>
              <blockquote className="border-l-4 border-cyan pl-4 text-gray-400 italic">
                Ready for developers to build — no translation needed.
              </blockquote>
            </div>
          </div>
        </section>

        {/* 🔵 CORE BENEFITS SECTION */}
        <section className="container mx-auto px-6 py-20 border-t border-white/5 bg-white/5 rounded-3xl my-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold">Why teams use BlueprintAI</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-navy rounded-2xl border border-white/10 hover:border-cyan/50 transition-colors">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">10x Faster Planning</h3>
              <p className="text-gray-400">Eliminate weeks of documentation and alignment meetings.</p>
            </div>
            <div className="p-6 bg-navy rounded-2xl border border-white/10 hover:border-cyan/50 transition-colors">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2">AI That Thinks Like a PM</h3>
              <p className="text-gray-400">Not generic text — real product reasoning.</p>
            </div>
            <div className="p-6 bg-navy rounded-2xl border border-white/10 hover:border-cyan/50 transition-colors">
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-xl font-bold mb-2">Always In Sync</h3>
              <p className="text-gray-400">Strategy, flows, and specs update together.</p>
            </div>
            <div className="p-6 bg-navy rounded-2xl border border-white/10 hover:border-cyan/50 transition-colors md:col-span-1.5">
              <div className="text-4xl mb-4">🛠</div>
              <h3 className="text-xl font-bold mb-2">Built for Builders</h3>
              <p className="text-gray-400">Developers receive clear, structured requirements.</p>
            </div>
            <div className="p-6 bg-navy rounded-2xl border border-white/10 hover:border-cyan/50 transition-colors md:col-span-1.5">
              <div className="text-4xl mb-4">📐</div>
              <h3 className="text-xl font-bold mb-2">Visual First</h3>
              <p className="text-gray-400">See the product before writing a single line of code.</p>
            </div>
          </div>
        </section>

        {/* 🔵 PRODUCT DEMO SECTION */}
        <section id="demo" className="container mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">See BlueprintAI in Action</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Watch how a raw idea becomes a full engineering blueprint in under 2 minutes.</p>
          
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan/10 bg-white/5 aspect-video flex items-center justify-center group cursor-pointer max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60"></div>
            <div className="w-20 h-20 bg-cyan/90 rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm shadow-lg shadow-cyan/20 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-navy">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute bottom-8 left-8 right-8 z-10 text-left">
               <h3 className="text-2xl font-bold text-white mb-2">Product Walkthrough</h3>
               <p className="text-gray-300">Watch the Demo</p>
            </div>
          </div>
        </section>

        {/* 🔵 FEATURE HIGHLIGHTS */}
        <section className="container mx-auto px-6 py-20 border-t border-white/5">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="border-b border-white/10 pb-8 md:border-b-0 md:border-r md:pr-8">
              <h3 className="text-cyan font-bold text-sm mb-2">Feature 1 — Visual Canvas</h3>
              <h4 className="text-2xl font-bold mb-2">Design real product flows, not static diagrams.</h4>
              <p className="text-gray-400">AI-generated, fully editable, and aware of product logic.</p>
            </div>
            <div className="border-b border-white/10 pb-8 md:border-b-0 md:pl-8">
              <h3 className="text-cyan font-bold text-sm mb-2">Feature 2 — AI-Generated PRDs & Specs</h3>
              <h4 className="text-2xl font-bold mb-2">Stop writing documents. Start generating them.</h4>
              <p className="text-gray-400">From personas to APIs — produced automatically.</p>
            </div>
            <div className="border-b border-white/10 pb-8 md:border-b-0 md:border-r md:pr-8">
              <h3 className="text-cyan font-bold text-sm mb-2">Feature 3 — Project System</h3>
              <h4 className="text-2xl font-bold mb-2">Organize everything by product.</h4>
              <p className="text-gray-400">Each project contains its own strategy, canvas, and outputs.</p>
            </div>
            <div className="md:pl-8">
              <h3 className="text-cyan font-bold text-sm mb-2">Feature 4 — Team Collaboration (Pro & Team)</h3>
              <h4 className="text-2xl font-bold mb-2">Build together in real time.</h4>
              <p className="text-gray-400">Shared projects, aligned thinking, fewer misunderstandings.</p>
            </div>
          </div>
        </section>

        {/* 🔵 PRICING SECTION */}
        <section id="pricing" className="container mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Simple pricing that scales with you</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all flex flex-col">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Free</h3>
                <p className="text-gray-400 text-sm mt-1">For exploration & early ideas</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-gray-300"><span className="text-cyan">✓</span> 1 project</li>
                <li className="flex items-center gap-2 text-gray-300"><span className="text-cyan">✓</span> Limited AI usage</li>
                <li className="flex items-center gap-2 text-gray-300"><span className="text-cyan">✓</span> Local drafts</li>
                <li className="flex items-center gap-2 text-gray-300"><span className="text-cyan">✓</span> Basic canvas</li>
              </ul>
              <Link href="/signup" className="block w-full py-3 rounded-lg border border-white/20 hover:bg-white hover:text-navy text-center font-bold transition-all">
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-navy rounded-2xl p-8 border-2 border-cyan relative flex flex-col transform md:-translate-y-4 shadow-2xl shadow-cyan/10">
              <div className="absolute top-0 right-0 bg-cyan text-navy text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">RECOMMENDED</div>
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-cyan">Pro</h3>
                <p className="text-gray-400 text-sm mt-1">For solo founders & builders</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-white"><span className="text-cyan">✓</span> Unlimited projects</li>
                <li className="flex items-center gap-2 text-white"><span className="text-cyan">✓</span> Higher AI limits</li>
                <li className="flex items-center gap-2 text-white"><span className="text-cyan">✓</span> Cloud sync</li>
                <li className="flex items-center gap-2 text-white"><span className="text-cyan">✓</span> Full spec generation</li>
              </ul>
              <Link href="/signup?plan=pro" className="block w-full py-3 rounded-lg bg-cyan text-navy hover:bg-white text-center font-bold transition-all">
                Upgrade to Pro
              </Link>
            </div>

            {/* Team */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all flex flex-col">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-amber">Team</h3>
                <p className="text-gray-400 text-sm mt-1">For startups & agencies</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-gray-300"><span className="text-amber">✓</span> Unlimited collaborators</li>
                <li className="flex items-center gap-2 text-gray-300"><span className="text-amber">✓</span> Priority AI processing</li>
                <li className="flex items-center gap-2 text-gray-300"><span className="text-amber">✓</span> Shared canvases</li>
                <li className="flex items-center gap-2 text-gray-300"><span className="text-amber">✓</span> Advanced collaboration</li>
              </ul>
              <Link href="/signup?plan=team" className="block w-full py-3 rounded-lg border border-white/20 hover:bg-amber hover:text-navy hover:border-amber text-center font-bold transition-all">
                Start Team Plan
              </Link>
            </div>
          </div>
        </section>

        {/* 🔵 TRUST & CREDIBILITY SECTION */}
        <section className="container mx-auto px-6 py-24 border-t border-white/5 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Built for people who ship products</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="p-6">
              <h4 className="font-bold text-lg mb-2">Non-technical founders</h4>
              <p className="text-gray-400 text-sm">building their first product</p>
            </div>
            <div className="p-6 border-x border-white/5">
              <h4 className="font-bold text-lg mb-2">Product managers</h4>
              <p className="text-gray-400 text-sm">tired of outdated PRDs</p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-lg mb-2">Teams</h4>
              <p className="text-gray-400 text-sm">that want alignment before writing code</p>
            </div>
          </div>
          
          <div className="inline-block px-6 py-3 bg-white/5 rounded-full border border-white/10">
            <p className="text-gray-300 italic">"The goal isn’t more documents — it’s better products."</p>
          </div>

          <div className="mt-16">
            <Testimonials />
          </div>
        </section>

        {/* 🔵 FINAL CTA SECTION */}
        <section className="container mx-auto px-6 py-24 border-t border-white/5 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Your product idea deserves clarity.</h2>
            <p className="text-xl text-gray-300 mb-10">
              Stop guessing. Stop rewriting specs.<br/>
              Start building from a real blueprint.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/dashboard" className="bg-cyan text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all w-full md:w-auto">
                Start Free — Build Your Blueprint
              </Link>
              <Link href="#pricing" className="border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:border-white transition-all w-full md:w-auto">
                View Pricing
              </Link>
            </div>

            <FinalCTAAnimation />
          </div>
        </section>
      </main>

      <footer className="mt-24 border-t border-white/10 relative z-10 bg-navy">
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">BlueprintAI</div>
          <p className="text-gray-400 text-lg mb-2">AI-Powered Product Realization</p>
          <p className="text-gray-500 text-sm">From idea → strategy → visual flows → engineering specs</p>
          <p className="mt-12 text-xs text-gray-600">© 2025 BlueprintAI</p>
        </div>
      </footer>
    </div>
  );
}
