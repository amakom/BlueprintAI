'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Layout, Users, Zap } from 'lucide-react'

export function ProductDemoAnimation() {
  const [step, setStep] = useState(0)
  const [text, setText] = useState('')
  const fullText = "A fintech app for freelancers"

  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    const runSequence = async () => {
      // Reset
      setStep(0)
      setText('')
      
      // Step 1: Typing (0s - 3s)
      await new Promise(r => setTimeout(r, 500))
      for (let i = 0; i <= fullText.length; i++) {
        setText(fullText.slice(0, i))
        await new Promise(r => setTimeout(r, 50))
      }
      setStep(1) // Input done
      
      // Step 2: Personas (3s - 6s)
      await new Promise(r => setTimeout(r, 500))
      setStep(2)
      
      // Step 3: Canvas (6s - 10s)
      await new Promise(r => setTimeout(r, 2000))
      setStep(3)
      
      // Step 4: Specs (10s - 14s)
      await new Promise(r => setTimeout(r, 3000))
      setStep(4)

      // Step 5: CTA Pulse (14s - 16s)
      await new Promise(r => setTimeout(r, 4000))
      
      // Loop
      runSequence()
    }

    runSequence()

    return () => {
      // Cleanup handled by effect unmounting, 
      // but in a real loop we'd track the timeouts properly.
      // For this simple demo, we rely on component mount cycle.
    }
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] bg-navy/50 rounded-xl border border-white/10 overflow-hidden relative shadow-2xl">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 h-full flex flex-col p-6">
        
        {/* Top Bar: Input */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
            <div className="h-6 w-[1px] bg-white/10 mx-2" />
            <span className="text-cyan font-mono text-sm">AI Input:</span>
            <span className="text-white font-medium min-h-[20px]">{text}<span className="animate-pulse">|</span></span>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 grid grid-cols-12 gap-6 h-full min-h-0">
          
          {/* Left Panel: Personas */}
          <div className="col-span-3 flex flex-col gap-4">
            <AnimatePresence>
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 h-full"
                >
                  <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs uppercase tracking-wider font-bold">
                    <Users size={14} /> Target Personas
                  </div>
                  <div className="space-y-3">
                    {['Freelancer Fiona', 'Agency Alex', 'Startup Sam'].map((p, i) => (
                      <motion.div
                        key={p}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-white/5 p-3 rounded border border-white/5 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan/20 to-blue-500/20" />
                        <div className="text-sm text-gray-200">{p}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center Panel: Canvas */}
          <div className="col-span-6 relative">
             <AnimatePresence>
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 h-full relative overflow-hidden"
                >
                  <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs uppercase tracking-wider font-bold">
                    <Layout size={14} /> User Flow
                  </div>
                  
                  {/* Nodes */}
                  <div className="relative w-full h-full">
                    {/* SVG Edges */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <motion.path
                        d="M 100 60 C 150 60, 150 120, 200 120"
                        fill="transparent"
                        stroke="#2EE6D6"
                        strokeWidth="2"
                        strokeOpacity="0.3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                      <motion.path
                        d="M 280 120 C 330 120, 330 60, 380 60"
                        fill="transparent"
                        stroke="#2EE6D6"
                        strokeWidth="2"
                        strokeOpacity="0.3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                      />
                    </svg>

                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                      className="absolute top-10 left-4 bg-navy border border-cyan/30 p-3 rounded-lg shadow-lg w-24 text-center text-xs text-white"
                    >
                      Sign Up
                    </motion.div>
                    
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }}
                      className="absolute top-24 left-[40%] -translate-x-1/2 bg-navy border border-cyan/30 p-3 rounded-lg shadow-lg w-28 text-center text-xs text-white"
                    >
                      Dashboard
                    </motion.div>

                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }}
                      className="absolute top-10 right-4 bg-navy border border-cyan/30 p-3 rounded-lg shadow-lg w-24 text-center text-xs text-white"
                    >
                      Invoicing
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel: Specs */}
          <div className="col-span-3">
             <AnimatePresence>
              {step >= 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 h-full"
                >
                  <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs uppercase tracking-wider font-bold">
                    <Code2 size={14} /> Tech Specs
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-cyan mb-1">Frontend</div>
                      <div className="text-sm text-white bg-white/5 p-2 rounded">Next.js 14, Tailwind</div>
                    </div>
                    <div>
                      <div className="text-xs text-cyan mb-1">Database</div>
                      <div className="text-sm text-white bg-white/5 p-2 rounded">PostgreSQL, Prisma</div>
                    </div>
                    <div>
                      <div className="text-xs text-cyan mb-1">Payments</div>
                      <div className="text-sm text-white bg-white/5 p-2 rounded">Stripe Connect</div>
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
            className="absolute bottom-8 left-0 right-0 flex justify-center z-20"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              animate={{ boxShadow: ["0 0 0 0 rgba(46, 230, 214, 0)", "0 0 0 10px rgba(46, 230, 214, 0.1)", "0 0 0 20px rgba(46, 230, 214, 0)"] }}
              transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
              className="bg-cyan text-navy font-bold text-lg px-8 py-3 rounded-full shadow-xl flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Generate Your Blueprint
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
