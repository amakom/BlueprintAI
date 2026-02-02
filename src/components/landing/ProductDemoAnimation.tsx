'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Send, 
  Users, 
  Layout, 
  FileText, 
  Zap, 
  CreditCard, 
  Search, 
  User,
  ArrowRight,
  Code2,
  Database,
  Lock
} from 'lucide-react'

export function ProductDemoAnimation() {
  const [step, setStep] = useState(0)
  const [text, setText] = useState('')
  const fullText = "A fintech app for freelancers"

  useEffect(() => {
    let mounted = true
    
    const runSequence = async () => {
      while (mounted) {
        // Reset
        setStep(0)
        setText('')
        
        // Step 1: Typing (0s - 3s)
        await new Promise(r => setTimeout(r, 800))
        for (let i = 0; i <= fullText.length; i++) {
          if (!mounted) return
          setText(fullText.slice(0, i))
          await new Promise(r => setTimeout(r, 40))
        }
        await new Promise(r => setTimeout(r, 400))
        if (!mounted) return
        setStep(1) // Sent
        
        // Step 2: Personas (3s - 6.5s)
        await new Promise(r => setTimeout(r, 600))
        if (!mounted) return
        setStep(2)
        
        // Step 3: Canvas (6.5s - 11s)
        await new Promise(r => setTimeout(r, 3500))
        if (!mounted) return
        setStep(3)
        
        // Step 4: Specs (11s - 15s)
        await new Promise(r => setTimeout(r, 4500))
        if (!mounted) return
        setStep(4) // CTA

        // Hold end state
        await new Promise(r => setTimeout(r, 4000))
      }
    }

    runSequence()

    return () => { mounted = false }
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] bg-[#0B1F33] rounded-xl border border-white/10 overflow-hidden relative shadow-2xl ring-1 ring-white/5 font-sans">
      {/* Background Grid (Matches Canvas) */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 h-full flex flex-col">
        
        {/* App Header (Fake Navigation) */}
        <div className="h-12 border-b border-white/10 bg-[#0B1F33]/90 backdrop-blur-sm flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-cyan rounded-md flex items-center justify-center text-navy text-xs font-bold">B</div>
            <span className="text-sm font-bold text-white">BlueprintAI</span>
            <span className="text-xs text-slate-500 ml-2">/ Fintech App</span>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Sidebar (Fake) */}
          <div className="w-12 border-r border-white/10 flex flex-col items-center py-4 gap-4 bg-[#0B1F33]/50">
            <div className={`p-2 rounded-lg ${step >= 2 ? 'bg-cyan/10 text-cyan' : 'text-slate-500'}`}><Users size={18} /></div>
            <div className={`p-2 rounded-lg ${step >= 3 ? 'bg-cyan/10 text-cyan' : 'text-slate-500'}`}><Layout size={18} /></div>
            <div className={`p-2 rounded-lg ${step >= 4 ? 'bg-cyan/10 text-cyan' : 'text-slate-500'}`}><FileText size={18} /></div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative p-6 overflow-hidden">
            
            {/* AI Input Overlay (Disappears after step 1) */}
            <AnimatePresence>
              {step < 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                >
                  <div className="w-full max-w-lg bg-[#0B1F33] border border-white/20 rounded-xl shadow-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-cyan text-xs font-bold uppercase tracking-wider">
                      <Sparkles size={12} />
                      AI Product Manager
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="text-lg text-white font-medium min-h-[28px]">
                        {text}<span className="animate-pulse text-cyan">|</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-3">
                       <span className="text-xs text-slate-500">Press Enter to generate blueprint</span>
                       <div className={`p-2 rounded-lg transition-colors ${step >= 1 ? 'bg-cyan text-navy' : 'bg-white/10 text-slate-400'}`}>
                         <Send size={16} />
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Workspace Content */}
            <div className="grid grid-cols-12 gap-6 h-full">
              
              {/* Personas Panel */}
              <AnimatePresence>
                {step >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="col-span-4 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <Users size={14} /> Target Personas
                    </div>
                    
                    {[
                      { name: 'Freelancer Fiona', role: 'Gig Worker', icon: User, color: 'bg-purple-500' },
                      { name: 'Agency Alex', role: 'Business Owner', icon: Users, color: 'bg-blue-500' }
                    ].map((p, i) => (
                      <motion.div
                        key={p.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-white/5 border border-white/10 p-4 rounded-xl flex gap-3 items-start"
                      >
                        <div className={`w-10 h-10 rounded-full ${p.color}/20 flex items-center justify-center text-white shrink-0`}>
                          <p.icon size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{p.name}</div>
                          <div className="text-xs text-slate-400">{p.role}</div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-300">Income Tracking</span>
                            <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-300">Invoices</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Canvas Panel */}
              <AnimatePresence>
                {step >= 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="col-span-4 relative bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                  >
                    <div className="absolute top-3 left-3 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider z-10">
                      <Layout size={14} /> User Flow
                    </div>
                    
                    {/* SVG Connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      <motion.path
                        d="M 50 80 C 50 120, 100 120, 100 160"
                        fill="transparent"
                        stroke="#2EE6D6"
                        strokeWidth="2"
                        strokeOpacity="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                      <motion.path
                        d="M 150 160 C 150 120, 200 120, 200 80"
                        fill="transparent"
                        stroke="#2EE6D6"
                        strokeWidth="2"
                        strokeOpacity="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </svg>

                    {/* Nodes */}
                    <div className="absolute inset-0 p-4 pt-10">
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-16 left-8 w-28 bg-[#0B1F33] border border-cyan/50 p-2 rounded-lg shadow-lg z-10"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 rounded bg-cyan/20 flex items-center justify-center"><User size={10} className="text-cyan"/></div>
                          <span className="text-[10px] font-bold text-white">Sign Up</span>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 bg-[#0B1F33] border border-cyan/50 p-2 rounded-lg shadow-lg z-10"
                      >
                         <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 rounded bg-cyan/20 flex items-center justify-center"><CreditCard size={10} className="text-cyan"/></div>
                          <span className="text-[10px] font-bold text-white">Dashboard</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded mt-1"/>
                        <div className="h-1 w-2/3 bg-white/10 rounded mt-1"/>
                      </motion.div>

                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }}
                        className="absolute top-16 right-8 w-28 bg-[#0B1F33] border border-cyan/50 p-2 rounded-lg shadow-lg z-10"
                      >
                         <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 rounded bg-cyan/20 flex items-center justify-center"><FileText size={10} className="text-cyan"/></div>
                          <span className="text-[10px] font-bold text-white">Invoices</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Specs Panel */}
              <AnimatePresence>
                {step >= 4 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="col-span-4 flex flex-col gap-4"
                  >
                     <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <Code2 size={14} /> Tech Specs
                    </div>
                    
                    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4 font-mono text-[10px] text-slate-300 leading-relaxed overflow-hidden relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan to-blue-500" />
                      <div className="space-y-2">
                        <p><span className="text-purple-400">const</span> <span className="text-yellow-200">stack</span> = {'{'}</p>
                        <p className="pl-4">frontend: <span className="text-green-400">'Next.js 14'</span>,</p>
                        <p className="pl-4">ui: <span className="text-green-400">'Tailwind CSS'</span>,</p>
                        <p className="pl-4">db: <span className="text-green-400">'PostgreSQL'</span>,</p>
                        <p className="pl-4">payments: <span className="text-green-400">'Stripe Connect'</span></p>
                        <p>{'};'}</p>
                        <p className="text-slate-500">// Generated API Endpoints</p>
                        <p><span className="text-blue-400">POST</span> /api/invoices/create</p>
                        <p><span className="text-blue-400">GET</span> /api/analytics/revenue</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>

        {/* CTA Overlay */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 left-0 right-0 flex justify-center z-30"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(46, 230, 214, 0)", "0 0 0 10px rgba(46, 230, 214, 0.1)", "0 0 0 20px rgba(46, 230, 214, 0)"] 
                }}
                transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
                className="bg-cyan text-navy font-bold text-lg px-8 py-3 rounded-full shadow-xl flex items-center gap-2 border border-white/20"
              >
                <Zap className="w-5 h-5" />
                Generate Your Blueprint
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
