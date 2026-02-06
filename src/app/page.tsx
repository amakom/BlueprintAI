import Link from 'next/link';
import Image from 'next/image';
import { Testimonials } from '@/components/landing/Testimonials';
import { HeroSection } from '@/components/landing/HeroSection';
import { StrategyThinkingAnimation } from '@/components/landing/StrategyThinkingAnimation';
import { CanvasFlowAnimation } from '@/components/landing/CanvasFlowAnimation';
import { SpecConversionAnimation } from '@/components/landing/SpecConversionAnimation';
import { InteractiveCanvasNodeAnimation } from '@/components/landing/InteractiveCanvasNodeAnimation';
import { PricingCard } from '@/components/landing/PricingCard';
import { FadeUp, SlideIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/landing/ScrollAnimation';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy text-white selection:bg-cyan selection:text-navy font-sans overflow-x-hidden">
      {/* Grid Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
        }}
      />

      <nav className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between relative z-10">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/icon.svg" alt="BlueprintAI" width={32} height={32} className="rounded-md" />
          <span className="hidden md:block">BlueprintAI</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/login" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">Login</Link>
          <Link href="/signup" className="bg-cyan text-navy px-4 py-2 md:px-5 text-sm md:text-base rounded-md font-bold hover:bg-white transition-colors">Get Started</Link>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <HeroSection />

        {/* PROBLEM SECTION */}
        <section className="container mx-auto px-6 py-12 md:py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <FadeUp>
              <h2 className="text-2xl md:text-5xl font-bold mb-8 md:mb-12">
                Most Products Fail <span className="text-red-400">Because Nobody Planned Them Properly.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.2} className="bg-white/5 rounded-md p-6 md:p-12 border border-white/10 text-left">
              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 font-medium">You have the idea. But jumping straight into code without a blueprint is where every project goes wrong.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <ScaleIn delay={0.3}><span className="text-red-400 text-xl">&#10005;</span></ScaleIn>
                  <span className="text-gray-300 text-base md:text-lg">Vibe coders start building without knowing what they're building.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ScaleIn delay={0.4}><span className="text-red-400 text-xl">&#10005;</span></ScaleIn>
                  <span className="text-gray-300 text-base md:text-lg">PMs waste weeks writing specs that go stale before sprint 1.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ScaleIn delay={0.5}><span className="text-red-400 text-xl">&#10005;</span></ScaleIn>
                  <span className="text-gray-300 text-base md:text-lg">Designers hand off mockups with no context. Engineers guess what they mean.</span>
                </li>
              </ul>

              <FadeUp delay={0.4} className="p-6 bg-navy/50 rounded-md border border-white/5 text-center">
                <p className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-2">The Result?</p>
                <p className="text-xl md:text-2xl font-bold text-white">Rework, scope creep, and burned budgets.</p>
              </FadeUp>
            </FadeUp>

            <FadeUp delay={0.6}>
              <p className="mt-8 md:mt-12 text-xl md:text-2xl font-bold text-cyan">
                BlueprintAI gives you the plan before you write a single line of code.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* SOLUTION SECTION */}
        <section className="bg-white/5 border-y border-white/5">
          <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <SlideIn direction="left">
                <h2 className="text-2xl md:text-5xl font-bold mb-6 leading-tight">
                  Your AI Planning Partner. Always On. Always Sharp.
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                  The better the plan you give an AI agent, the better the product it builds.
                  BlueprintAI connects <strong className="text-white">strategy, user flows, and technical specs</strong> into one living blueprint — so every team member starts with clarity.
                </p>
              </SlideIn>
              <SlideIn direction="right" className="bg-navy/50 p-8 rounded-md border border-white/10">
                <h3 className="text-cyan font-bold mb-6 text-lg">Built For</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <ScaleIn delay={0.2} className="w-8 h-8 rounded-md bg-cyan/20 flex items-center justify-center text-cyan shrink-0 text-sm font-bold">VC</ScaleIn>
                    <div>
                      <span className="text-lg text-gray-200 font-bold">Vibe Coders</span>
                      <p className="text-sm text-gray-400 mt-1">Plan the project first. Build faster. Ship with confidence.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <ScaleIn delay={0.3} className="w-8 h-8 rounded-md bg-cyan/20 flex items-center justify-center text-cyan shrink-0 text-sm font-bold">PM</ScaleIn>
                    <div>
                      <span className="text-lg text-gray-200 font-bold">Product Managers</span>
                      <p className="text-sm text-gray-400 mt-1">Generate PRDs, user stories, and specs in minutes — not weeks.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <ScaleIn delay={0.4} className="w-8 h-8 rounded-md bg-cyan/20 flex items-center justify-center text-cyan shrink-0 text-sm font-bold">UX</ScaleIn>
                    <div>
                      <span className="text-lg text-gray-200 font-bold">UI/UX Designers</span>
                      <p className="text-sm text-gray-400 mt-1">Visualize user journeys and flows before opening Figma.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <ScaleIn delay={0.5} className="w-8 h-8 rounded-md bg-cyan/20 flex items-center justify-center text-cyan shrink-0 text-sm font-bold">EG</ScaleIn>
                    <div>
                      <span className="text-lg text-gray-200 font-bold">Engineers</span>
                      <p className="text-sm text-gray-400 mt-1">Get clear, structured requirements — database schemas, APIs, and screen specs.</p>
                    </div>
                  </li>
                </ul>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (3-STEP FLOW) */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <FadeUp className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
            <p className="mt-4 text-gray-400">From raw idea to production-ready blueprint in 3 steps</p>
          </FadeUp>

          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20 md:mb-32">
            <SlideIn direction="left" className="order-2 md:order-1">
              <StrategyThinkingAnimation />
            </SlideIn>
            <SlideIn direction="right" className="order-1 md:order-2">
              <div className="inline-block px-3 py-1 bg-cyan/10 text-cyan text-sm font-bold rounded-md mb-4">Step 1 — Strategic Intelligence</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Describe Your Idea. AI Builds the Strategy.</h3>
              <p className="text-gray-300 mb-6 text-lg">Tell BlueprintAI what you want to build. It asks the right questions and defines:</p>
              <ul className="space-y-2 mb-8 text-gray-300">
                <li className="flex items-center gap-2"><ScaleIn delay={0.2}><span className="w-1.5 h-1.5 bg-cyan rounded-sm"></span></ScaleIn> Who are your users? (Target Personas)</li>
                <li className="flex items-center gap-2"><ScaleIn delay={0.3}><span className="w-1.5 h-1.5 bg-cyan rounded-sm"></span></ScaleIn> What does success look like? (Goals & KPIs)</li>
                <li className="flex items-center gap-2"><ScaleIn delay={0.4}><span className="w-1.5 h-1.5 bg-cyan rounded-sm"></span></ScaleIn> Who else is in the market? (Competitor Analysis)</li>
              </ul>
              <blockquote className="border-l-4 border-cyan pl-4 text-gray-400 italic">
                Every vibe coder must plan the project first before diving into production.
              </blockquote>
            </SlideIn>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20 md:mb-32">
            <SlideIn direction="left">
              <div className="inline-block px-3 py-1 bg-cyan/10 text-cyan text-sm font-bold rounded-md mb-4">Step 2 — Visual Architecture</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Map the User Journey on a Visual Canvas.</h3>
              <p className="text-gray-300 mb-6 text-lg">An interactive canvas that feels like Figma meets a whiteboard:</p>
              <ul className="space-y-2 mb-8 text-gray-300">
                <li className="flex items-center gap-2"><ScaleIn delay={0.2}><span className="w-1.5 h-1.5 bg-cyan rounded-sm"></span></ScaleIn> AI maps out screens, user stories, and data models</li>
                <li className="flex items-center gap-2"><ScaleIn delay={0.3}><span className="w-1.5 h-1.5 bg-cyan rounded-sm"></span></ScaleIn> Drag, drop, and refine the flow visually</li>
                <li className="flex items-center gap-2"><ScaleIn delay={0.4}><span className="w-1.5 h-1.5 bg-cyan rounded-sm"></span></ScaleIn> Designers see the UX. Engineers see the logic.</li>
              </ul>
              <blockquote className="border-l-4 border-cyan pl-4 text-gray-400 italic">
                See exactly how your product works before writing a single line of code.
              </blockquote>
            </SlideIn>
            <SlideIn direction="right">
              <CanvasFlowAnimation />
            </SlideIn>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <SlideIn direction="left" className="order-2 md:order-1">
              <SpecConversionAnimation />
            </SlideIn>
            <SlideIn direction="right" className="order-1 md:order-2">
              <div className="inline-block px-3 py-1 bg-cyan/10 text-cyan text-sm font-bold rounded-md mb-4">Step 3 — Technical Handoff</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Auto-Generate the Engineering Spec.</h3>
              <p className="text-gray-300 mb-6 text-lg">BlueprintAI reads your strategy and canvas, then produces:</p>
              <ul className="space-y-2 mb-8 text-gray-300">
                <li className="flex items-center gap-2"><ScaleIn delay={0.2}><span className="w-1.5 h-1.5 bg-cyan rounded-sm"></span></ScaleIn> Database schemas (Prisma-ready)</li>
                <li className="flex items-center gap-2"><ScaleIn delay={0.3}><span className="w-1.5 h-1.5 bg-cyan rounded-sm"></span></ScaleIn> API route definitions</li>
                <li className="flex items-center gap-2"><ScaleIn delay={0.4}><span className="w-1.5 h-1.5 bg-cyan rounded-sm"></span></ScaleIn> Screen component breakdowns</li>
              </ul>
              <blockquote className="border-l-4 border-cyan pl-4 text-gray-400 italic">
                Hand your AI coding agent or engineering team a blueprint they can actually execute.
              </blockquote>
            </SlideIn>
          </div>
        </section>

        {/* CORE BENEFITS SECTION */}
        <section className="container mx-auto px-6 py-12 md:py-20 border-t border-white/5 bg-white/5 rounded-md my-10">
          <FadeUp className="text-center mb-12">
            <h2 className="text-2xl md:text-5xl font-bold">Why Teams Choose BlueprintAI</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Save a ton of headaches by planning properly from the beginning.</p>
          </FadeUp>
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            <StaggerItem className="p-6 bg-navy rounded-md border border-white/10 hover:border-cyan/50 transition-colors">
              <ScaleIn delay={0.2} className="text-4xl mb-4">&#9889;</ScaleIn>
              <h3 className="text-xl font-bold mb-2">Plan in Minutes, Not Months</h3>
              <p className="text-gray-400">Eliminate weeks of alignment meetings and outdated docs. Go from idea to structured plan instantly.</p>
            </StaggerItem>
            <StaggerItem className="p-6 bg-navy rounded-md border border-white/10 hover:border-cyan/50 transition-colors">
              <ScaleIn delay={0.3} className="text-4xl mb-4">&#129504;</ScaleIn>
              <h3 className="text-xl font-bold mb-2">AI That Asks the Right Questions</h3>
              <p className="text-gray-400">Not generic text. BlueprintAI probes your idea to uncover gaps, define scope, and sharpen the plan.</p>
            </StaggerItem>
            <StaggerItem className="p-6 bg-navy rounded-md border border-white/10 hover:border-cyan/50 transition-colors">
              <ScaleIn delay={0.4} className="text-4xl mb-4">&#128260;</ScaleIn>
              <h3 className="text-xl font-bold mb-2">Strategy, Flows, and Specs Stay in Sync</h3>
              <p className="text-gray-400">Change the strategy and the specs update. No more outdated documents floating around Notion.</p>
            </StaggerItem>
            <StaggerItem className="p-6 bg-navy rounded-md border border-white/10 hover:border-cyan/50 transition-colors md:col-span-1">
              <ScaleIn delay={0.5} className="text-4xl mb-4">&#128736;</ScaleIn>
              <h3 className="text-xl font-bold mb-2">Engineers Get What They Need</h3>
              <p className="text-gray-400">Clear, structured requirements with schemas, APIs, and screen specs. No more guesswork.</p>
            </StaggerItem>
            <StaggerItem className="p-6 bg-navy rounded-md border border-white/10 hover:border-cyan/50 transition-colors md:col-span-1">
              <ScaleIn delay={0.6} className="text-4xl mb-4">&#128208;</ScaleIn>
              <h3 className="text-xl font-bold mb-2">Designers See the Full Picture</h3>
              <p className="text-gray-400">Visual user journeys and flows give UI/UX designers the context to create great experiences.</p>
            </StaggerItem>
            <StaggerItem className="p-6 bg-navy rounded-md border border-white/10 hover:border-cyan/50 transition-colors md:col-span-1">
              <ScaleIn delay={0.7} className="text-4xl mb-4">&#128640;</ScaleIn>
              <h3 className="text-xl font-bold mb-2">Ship With Audacity</h3>
              <p className="text-gray-400">When every feature is planned, scoped, and documented — you build with confidence, not anxiety.</p>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* PRODUCT DEMO SECTION */}
        <section id="demo" className="container mx-auto px-6 py-16 md:py-24 text-center">
          <FadeUp>
            <h2 className="text-2xl md:text-5xl font-bold mb-4">See BlueprintAI in Action</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Watch how a raw idea becomes a production-ready blueprint — with strategy, visual flows, and engineering specs.</p>
          </FadeUp>

          <ScaleIn delay={0.2} className="relative rounded-md overflow-hidden border border-white/10 shadow-2xl shadow-cyan/10 bg-white/5 aspect-video flex items-center justify-center group cursor-pointer max-w-5xl mx-auto">
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-md flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white ml-1">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-white text-lg tracking-wide">Watch Demo</span>
            </div>
          </ScaleIn>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section className="container mx-auto px-6 py-12 md:py-20 border-t border-white/5">
          <FadeUp className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold">Every Feature Actually Works</h2>
            <p className="mt-4 text-gray-400">No half-baked demos. Real tools for real product teams.</p>
          </FadeUp>
          <StaggerContainer className="grid md:grid-cols-2 gap-8 md:gap-12">
            <StaggerItem className="border-b border-white/10 pb-8 md:border-b-0 md:border-r md:pr-8">
              <InteractiveCanvasNodeAnimation />
              <h3 className="text-cyan font-bold text-sm mb-2">Visual Canvas</h3>
              <h4 className="text-xl md:text-2xl font-bold mb-2">Design real product flows, not static diagrams.</h4>
              <p className="text-gray-400">AI-generated, fully editable nodes and edges. Drag, connect, and see your product take shape on an interactive canvas.</p>
            </StaggerItem>
            <StaggerItem className="border-b border-white/10 pb-8 md:border-b-0 md:pl-8">
              <h3 className="text-cyan font-bold text-sm mb-2">AI Planning Engine</h3>
              <h4 className="text-xl md:text-2xl font-bold mb-2">AI asks clarifying questions to sharpen your plan.</h4>
              <p className="text-gray-400">From user personas to database schemas — the AI probes, refines, and produces structured output automatically.</p>
            </StaggerItem>
            <StaggerItem className="border-b border-white/10 pb-8 md:border-b-0 md:border-r md:pr-8">
              <h3 className="text-cyan font-bold text-sm mb-2">Project Hub</h3>
              <h4 className="text-xl md:text-2xl font-bold mb-2">Organize every blueprint by product.</h4>
              <p className="text-gray-400">Keep strategy, visual flows, and technical specs in one place. No more scattered docs across 5 different tools.</p>
            </StaggerItem>
            <StaggerItem className="md:pl-8">
              <h3 className="text-cyan font-bold text-sm mb-2">Team Collaboration (Pro & Team)</h3>
              <h4 className="text-xl md:text-2xl font-bold mb-2">Build together in real time.</h4>
              <p className="text-gray-400">Shared projects, live cursors, and aligned thinking. PMs, designers, and engineers on the same page — literally.</p>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="container mx-auto px-6 py-16 md:py-24 border-t border-white/5">
          <FadeUp className="text-center mb-16">
            <h2 className="text-2xl md:text-5xl font-bold">Early Access — Limited Beta</h2>
            <p className="mt-4 text-gray-400">Get lifetime Pro access for a one-time price. Only 20 spots available.</p>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            <PricingCard
              title="Free"
              description="For exploring ideas & solo vibe coding"
              price="$0"
              period="forever"
              features={["1 project", "5 AI generations/month", "Basic visual canvas", "Local drafts"]}
              ctaText="Start Free"
              ctaLink="/signup"
              variant="default"
              delay={0}
            />
            <PricingCard
              title="Pro — Lifetime"
              description="Beta testers get Pro forever. No subscriptions."
              price="$49"
              period="one-time"
              badge="BETA — 20 SPOTS"
              features={["Unlimited projects", "100 AI generations/month", "Cloud sync & export", "Full engineering specs", "Priority support", "All future Pro updates"]}
              ctaText="Get Lifetime Access"
              ctaLink="/pricing"
              variant="pro"
              delay={0.1}
            />
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="container mx-auto px-6 py-12 md:py-20 text-center border-t border-white/5">
          <FadeUp>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest">Built for modern product teams</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
              <span className="text-lg md:text-xl font-bold">Indie Hackers</span>
              <span className="text-lg md:text-xl font-bold">YC Startups</span>
              <span className="text-lg md:text-xl font-bold">Design Studios</span>
              <span className="text-lg md:text-xl font-bold">Dev Agencies</span>
            </div>
          </FadeUp>
        </section>

        {/* TESTIMONIALS SECTION */}
        <Testimonials />

        {/* FINAL CTA */}
        <section className="container mx-auto px-6 py-20 md:py-32 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-6xl font-bold mb-6">Ready to build with a plan?</h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Stop guessing. Start planning. Every great product starts with a great blueprint.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="px-8 py-4 bg-cyan text-navy font-bold rounded-md hover:bg-white transition-all text-lg shadow-lg shadow-cyan/20">
                Get Started for Free
              </Link>
              <Link href="#demo" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-md hover:bg-white/10 transition-all text-lg">
                View Demo
              </Link>
            </div>
          </FadeUp>
        </section>
      </main>

      <footer className="mt-24 border-t border-white/10 relative z-10 bg-navy">
        <div className="container mx-auto px-6 py-16 text-center">
          <Link href="/" className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 inline-block hover:opacity-80 transition-opacity">BlueprintAI</Link>
          <p className="text-gray-400 text-lg mb-2">Plan It. See It. Build It.</p>
          <p className="text-gray-500 text-sm">For Vibe Coders, PMs, Designers & Engineers</p>
          <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-gray-500">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <a href="mailto:support@blueprintai.dev" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="mt-8 text-xs text-gray-600">&copy; {new Date().getFullYear()} BlueprintAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
