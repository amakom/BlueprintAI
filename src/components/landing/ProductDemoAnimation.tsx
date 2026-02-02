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
  User,
  Home,
  Settings,
  Folder,
  Share2,
  Play,
  Clock,
  Download,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Moon,
  PanelRight,
  Code2
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
        
        // Step 1: Typing (0s - 2.5s)
        await new Promise(r => setTimeout(r, 800))
        for (let i = 0; i <= fullText.length; i++) {
          if (!mounted) return
          setText(fullText.slice(0, i))
          await new Promise(r => setTimeout(r, 40))
        }
        await new Promise(r => setTimeout(r, 400))
        if (!mounted) return
        setStep(1) // Sent
        
        // Step 2: Processing/Personas (2.5s - 6s)
        await new Promise(r => setTimeout(r, 600))
        if (!mounted) return
        setStep(2)
        
        // Step 3: Canvas Building (6s - 10s)
        await new Promise(r => setTimeout(r, 3500))
        if (!mounted) return
        setStep(3)
        
        // Step 4: Specs/Final (10s - 15s)
        await new Promise(r => setTimeout(r, 4000))
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
    <div className="w-full max-w-6xl mx-auto aspect-[16/10] bg-[#0B1F33] rounded-xl border border-white/10 overflow-hidden relative shadow-2xl ring-1 ring-white/5 font-sans flex text-slate-300">
      
      {/* LEFT SIDEBAR */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-[#0B1F33]">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 gap-2 border-b border-white/5">
          <div className="w-8 h-8 bg-cyan rounded-md flex items-center justify-center text-navy font-bold text-lg">B</div>
          <span className="font-bold text-white tracking-tight">BlueprintAI</span>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Menu</div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-white/5 rounded-lg cursor-pointer">
            <Home size={16} /> Home
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-white bg-white/10 rounded-lg font-medium cursor-pointer">
            <Folder size={16} className="text-cyan" /> Projects
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-white/5 rounded-lg cursor-pointer">
            <Users size={16} /> Team
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-white/5 rounded-lg cursor-pointer">
            <Settings size={16} /> Settings
          </div>
        </div>

        {/* Recent Projects */}
        <div className="p-4 pt-0 mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recent Projects</div>
            <Plus size={12} className="text-cyan cursor-pointer" />
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-cyan/80 bg-cyan/5 rounded-lg cursor-pointer border border-cyan/10">
            <FileText size={16} /> Monra
          </div>
        </div>

        <div className="flex-1" />

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan text-navy flex items-center justify-center font-bold text-xs">L</div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium text-white truncate">Lota</div>
              <div className="text-xs text-slate-500 truncate">TEAM Plan</div>
            </div>
            <div className="text-slate-500"><MoreHorizontal size={16} /></div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#061424]">
        
        {/* TOP HEADER */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#0B1F33]">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Projects</span>
            <span className="text-slate-600">/</span>
            <span className="font-bold text-white">Monra</span>
            <span className="ml-2 px-2 py-0.5 bg-white/5 text-xs rounded-full text-slate-400">Draft</span>
          </div>

          {/* Center Tabs */}
          <div className="flex bg-white/5 p-1 rounded-lg">
            <div className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${step < 4 ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400'}`}>Canvas</div>
            <div className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-white transition-colors">Strategy</div>
            <div className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${step >= 4 ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400'}`}>Specs</div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE
            </div>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <button className="p-2 text-slate-400 hover:text-white"><Clock size={16} /></button>
            <button className="p-2 text-slate-400 hover:text-white"><Play size={16} /></button>
            <button className="p-2 text-slate-400 hover:text-white"><Download size={16} /></button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-navy rounded-lg text-sm font-bold hover:bg-cyan transition-colors">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="flex-1 flex min-h-0 relative">
          
          {/* CENTER CANVAS */}
          <div className="flex-1 relative overflow-hidden">
            {/* Grid Background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Animation Content Layer */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <AnimatePresence mode="wait">
                
                {/* Stage 1: Empty State / Initial */}
                {step < 2 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4 border border-white/10">
                      <Layout size={32} className="text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-sm">Canvas is empty. Use AI to generate a flow.</p>
                  </motion.div>
                )}

                {/* Stage 2: Personas */}
                {step === 2 && (
                  <motion.div className="flex gap-6">
                    {[
                      { name: 'Freelancer Fiona', role: 'User', icon: User, color: 'text-purple-400' },
                      { name: 'Agency Alex', role: 'Admin', icon: Users, color: 'text-blue-400' }
                    ].map((p, i) => (
                      <motion.div
                        key={p.name}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-48 bg-[#0B1F33] border border-white/10 rounded-xl p-4 shadow-xl relative group"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan/50 to-transparent rounded-t-xl" />
                        <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 ${p.color}`}>
                          <p.icon size={20} />
                        </div>
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.role}</div>
                        <div className="mt-3 space-y-1">
                          <div className="h-1.5 w-3/4 bg-white/10 rounded-full" />
                          <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Stage 3: Visual Flow */}
                {step === 3 && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                       <motion.path
                        d="M 300 200 L 450 200"
                        fill="transparent"
                        stroke="#2EE6D6"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.5 }}
                        transition={{ duration: 1 }}
                      />
                    </svg>

                    {/* Main Node */}
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative z-10 w-64 bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-cyan"
                    >
                      {/* Node Header */}
                      <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-2">
                        <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-orange-600">
                          <User size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-800">Lota Story</span>
                      </div>
                      {/* Node Body */}
                      <div className="p-4 bg-white">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">New userStory</h3>
                        <p className="text-xs text-slate-400">Edit this description...</p>
                      </div>
                      {/* Handles */}
                      <div className="absolute top-1/2 -left-1 w-2 h-2 bg-white border border-cyan rounded-full" />
                      <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white border border-cyan rounded-full" />
                      <div className="absolute -top-1 left-1/2 w-2 h-2 bg-white border border-cyan rounded-full" />
                      <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-white border border-cyan rounded-full" />
                    </motion.div>
                  </div>
                )}

                {/* Stage 4: Specs Overlay */}
                {step >= 4 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-4 bg-[#0B1F33]/95 backdrop-blur-sm border border-white/10 rounded-xl p-6 overflow-hidden flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-4 text-cyan font-bold">
                      <Code2 size={18} /> Engineering Specs
                    </div>
                    <div className="flex-1 font-mono text-xs text-slate-300 space-y-2">
                      <div className="flex gap-4 border-b border-white/5 pb-2 mb-2">
                        <span className="text-white border-b border-cyan pb-2">Stack</span>
                        <span className="text-slate-500">Database</span>
                        <span className="text-slate-500">API</span>
                      </div>
                      <p><span className="text-purple-400">const</span> <span className="text-yellow-200">config</span> = {'{'}</p>
                      <p className="pl-4">framework: <span className="text-green-400">'Next.js 14'</span>,</p>
                      <p className="pl-4">styling: <span className="text-green-400">'Tailwind CSS'</span>,</p>
                      <p className="pl-4">auth: <span className="text-green-400">'Clerk'</span>,</p>
                      <p className="pl-4">db: <span className="text-green-400">'PostgreSQL + Prisma'</span></p>
                      <p>{'};'}</p>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
            
            {/* Overlay Controls */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
              <div className="p-2 bg-[#0B1F33] border border-white/10 rounded-md text-slate-400 hover:text-white cursor-pointer"><Plus size={16} /></div>
              <div className="p-2 bg-[#0B1F33] border border-white/10 rounded-md text-slate-400 hover:text-white cursor-pointer"><Layout size={16} /></div>
            </div>

          </div>

          {/* RIGHT CHAT PANEL */}
          <div className="w-80 border-l border-white/10 bg-[#0B1F33] flex flex-col">
            <div className="h-12 border-b border-white/10 flex items-center justify-between px-4">
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-cyan rounded flex items-center justify-center text-navy font-bold text-[10px]">B</div>
                 <span className="font-bold text-white text-sm">BlueprintAI</span>
               </div>
               <PanelRight size={16} className="text-slate-500" />
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-hidden">
              {/* Initial Bot Message */}
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded bg-cyan/10 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={12} className="text-cyan" />
                </div>
                <div className="bg-white/5 rounded-lg rounded-tl-none p-3 text-xs text-slate-300 leading-relaxed">
                  Hi! I can help you draft your Mobile App PRD. Try asking me to "Generate user stories for login".
                </div>
              </div>

              {/* User Typing Animation */}
              {(text || step >= 1) && (
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                    <User size={12} className="text-purple-400" />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-purple-500/10 rounded-lg rounded-tr-none p-3 text-xs text-purple-100"
                  >
                    {text}
                  </motion.div>
                </div>
              )}

              {/* Bot Response Animation */}
              {step >= 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-6 h-6 rounded bg-cyan/10 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles size={12} className="text-cyan" />
                  </div>
                  <div className="bg-white/5 rounded-lg rounded-tl-none p-3 text-xs text-slate-300">
                    {step === 2 && "Identifying key personas..."}
                    {step === 3 && "Building user flow..."}
                    {step >= 4 && "Generating technical specifications..."}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              <div className="bg-white/5 rounded-lg p-2 flex items-center gap-2 border border-white/5">
                <input 
                  disabled
                  placeholder="Describe what you want to build..."
                  className="bg-transparent border-none text-xs text-white placeholder:text-slate-500 flex-1 focus:outline-none"
                />
                <button className="p-1.5 bg-cyan rounded text-navy hover:bg-white transition-colors">
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* CTA OVERLAY (Final Step) */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0B1F33]/60 backdrop-blur-[2px] z-50 flex items-center justify-center"
            >
              <motion.button
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="bg-cyan text-navy font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(46,230,214,0.3)] flex items-center gap-3 border border-white/20"
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
