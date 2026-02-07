import Link from 'next/link';
import Image from 'next/image';
import { Testimonials } from '@/components/landing/Testimonials';
import { HeroSection } from '@/components/landing/HeroSection';
import { StrategyThinkingAnimation } from '@/components/landing/StrategyThinkingAnimation';
import { CanvasFlowAnimation } from '@/components/landing/CanvasFlowAnimation';
import { SpecConversionAnimation } from '@/components/landing/SpecConversionAnimation';
import { InteractiveCanvasNodeAnimation } from '@/components/landing/InteractiveCanvasNodeAnimation';
import { PricingCard } from '@/components/landing/PricingCard';
import { ProductWalkthrough } from '@/components/landing/ProductWalkthrough';
import { SubscribeForm } from '@/components/landing/SubscribeForm';
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
                Most Products Fail <span className="text-red-400">Before the First Line of Code.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.2} className="bg-white/5 rounded-md p-6 md:p-12 border border-white/10 text-left">
              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 font-medium">You have the idea. But jumping straight into code without a plan is where things fall apart.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <ScaleIn delay={0.3}><span className="text-red-400 text-xl">&#10005;</span></ScaleIn>
                  <span className="text-gray-300 text-base md:text-lg">Developers start building without knowing what to build.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ScaleIn delay={0.4}><span className="text-red-400 text-xl">&#10005;</span></ScaleIn>
                  <span className="text-gray-300 text-base md:text-lg">Product managers spend weeks on specs that are outdated by sprint 1.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ScaleIn delay={0.5}><span className="text-red-400 text-xl">&#10005;</span></ScaleIn>
                  <span className="text-gray-300 text-base md:text-lg">Designers hand off mockups without context. Engineers guess the rest.</span>
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
                  One Tool. Complete Clarity. From Idea to Spec.
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                  The better the plan, the better the product.
                  BlueprintAI connects <strong className="text-white">strategy, user flows, and technical specs</strong> into one living blueprint — so every team member starts on the same page.
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
                The better the plan, the better the product. Every time.
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

        {/* AI CONTEXT CLEANER — HERO FEATURE */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-6 py-20 md:py-32 relative">
            <div className="max-w-5xl mx-auto">
              <FadeUp className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                  <span className="text-sm font-bold text-purple-300">The Feature That Changes Everything</span>
                </div>
                <h2 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight">
                  One Click. <span className="text-cyan">Perfect Prompt.</span><br />
                  Your AI Agent Builds the Rest.
                </h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  BlueprintAI&apos;s <strong className="text-white">Context Cleaner</strong> takes your entire project — personas, strategy, user stories, screen flows, KPIs, competitor analysis, and engineering specs — and packages it into one clean, structured prompt. Paste it into <strong className="text-white">Cursor, Claude, Copilot, or any AI coding agent</strong> and watch it build exactly what you planned.
                </p>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left: What gets included */}
                  <SlideIn direction="left" className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-8">
                    <h3 className="text-lg font-bold text-white mb-4">What your AI agent receives:</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Target Personas', desc: 'Who the users are, their goals & pain points', color: 'bg-amber-500/20 text-amber-400' },
                        { label: 'Product Strategy', desc: 'OKRs, KPIs, and competitive positioning', color: 'bg-blue-500/20 text-blue-400' },
                        { label: 'User Stories', desc: 'Every feature requirement, structured', color: 'bg-green-500/20 text-green-400' },
                        { label: 'Screen Map', desc: 'Pages, routes, and navigation flow', color: 'bg-purple-500/20 text-purple-400' },
                        { label: 'Engineering Spec', desc: 'Database schemas, API routes, components', color: 'bg-cyan/20 text-cyan' },
                        { label: 'Build Instructions', desc: 'Step-by-step implementation order', color: 'bg-red-500/20 text-red-400' },
                      ].map((item, i) => (
                        <ScaleIn key={item.label} delay={0.1 + i * 0.08}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${item.color}`}>
                              {i + 1}
                            </div>
                            <div>
                              <span className="text-white text-sm font-bold">{item.label}</span>
                              <span className="text-gray-500 text-sm ml-2">— {item.desc}</span>
                            </div>
                          </div>
                        </ScaleIn>
                      ))}
                    </div>
                  </SlideIn>

                  {/* Right: The prompt output preview */}
                  <SlideIn direction="right" className="bg-[#0d1117] border border-white/10 rounded-lg overflow-hidden font-mono text-[11px] md:text-xs">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/10">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                      </div>
                      <span className="text-gray-500 text-[10px] ml-2">prompt.md — copied to clipboard</span>
                    </div>
                    <div className="p-4 space-y-1.5 text-gray-400 max-h-[340px] overflow-hidden relative">
                      <div className="text-cyan font-bold"># Product Blueprint: PetWalk App</div>
                      <div className="text-gray-600">&gt; Generated by BlueprintAI</div>
                      <div className="mt-2 text-purple-400">## Target Users (Personas)</div>
                      <div>### 1. Busy Owner — Pet Parent</div>
                      <div className="text-gray-600">Goals: Quick booking, GPS tracking</div>
                      <div className="mt-2 text-blue-400">## OKRs &amp; KPIs</div>
                      <div>- D7 Retention: 42% | Conversion: 3.8%</div>
                      <div className="mt-2 text-green-400">## User Stories (5)</div>
                      <div>1. <span className="text-white">Sign Up</span>: Create account...</div>
                      <div>2. <span className="text-white">Search</span>: Find nearby walkers...</div>
                      <div className="mt-2 text-purple-400">## Screens &amp; Navigation</div>
                      <div>Sign Up → Dashboard → Search → Book</div>
                      <div className="mt-2 text-cyan">## Engineering Spec</div>
                      <div>model User &#123; id, email, role &#125;</div>
                      <div>POST /api/auth/register</div>
                      <div>GET  /api/walkers</div>
                      <div className="mt-2 text-red-400">## Implementation Order</div>
                      <div>1. Database schema</div>
                      <div>2. API routes</div>
                      <div>3. Frontend pages</div>
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d1117] to-transparent" />
                    </div>
                  </SlideIn>
                </div>
              </FadeUp>

              <FadeUp delay={0.4} className="text-center mt-12">
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
                  The better the prompt, the better the code. BlueprintAI gives your AI agent <strong className="text-white">10x more context</strong> than a blank chat window ever could.
                </p>
                <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-cyan text-navy font-bold rounded-md hover:bg-white transition-all text-lg shadow-lg shadow-cyan/20">
                  Try Context Cleaner Free
                </Link>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* CORE BENEFITS SECTION */}
        <section className="container mx-auto px-6 py-12 md:py-20 border-t border-white/5 bg-white/5 rounded-md my-10">
          <FadeUp className="text-center mb-12">
            <h2 className="text-2xl md:text-5xl font-bold">Why Teams Choose BlueprintAI</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">The right plan saves weeks of rework. Here&apos;s how BlueprintAI gets you there.</p>
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
              <h3 className="text-xl font-bold mb-2">Ship With Confidence</h3>
              <p className="text-gray-400">When every feature is planned, scoped, and documented — you build faster and ship without second-guessing.</p>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* PRODUCT DEMO SECTION */}
        <section id="demo" className="container mx-auto px-6 py-16 md:py-24">
          <FadeUp className="text-center mb-10">
            <h2 className="text-2xl md:text-5xl font-bold mb-4">See BlueprintAI in Action</h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">From raw idea to production-ready blueprint in 3 steps. Click through or let it play.</p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <ProductWalkthrough />
          </FadeUp>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section className="container mx-auto px-6 py-12 md:py-20 border-t border-white/5">
          <FadeUp className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold">Built for Real Product Teams</h2>
            <p className="mt-4 text-gray-400">Tools that work the way you think — from canvas to codebase.</p>
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
            <p className="mt-4 text-gray-400">Get lifetime Pro access for a one-time price. Only 50 spots available.</p>
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
              badge="BETA — 50 SPOTS"
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
            <h2 className="text-3xl md:text-6xl font-bold mb-6">Stop Guessing. Start Building.</h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Every great product starts with a great plan. Create your first blueprint in under 5 minutes — free.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup" className="px-8 py-4 bg-cyan text-navy font-bold rounded-md hover:bg-white transition-all text-lg shadow-lg shadow-cyan/20">
                Get Started for Free
              </Link>
              <Link href="#demo" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-md hover:bg-white/10 transition-all text-lg">
                View Demo
              </Link>
            </div>

            <div className="border-t border-white/10 pt-8">
              <p className="text-sm text-gray-500 mb-4">Not ready to sign up? Stay in the loop:</p>
              <SubscribeForm />
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
