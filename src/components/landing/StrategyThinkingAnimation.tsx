 'use client'
 import { useEffect, useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

export function StrategyThinkingAnimation() {
  const reduce = useReducedMotion()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [phase, setPhase] = useState<'idea' | 'personas' | 'kpis' | 'competitors' | 'complete'>('idea')
  const [replayKey, setReplayKey] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let timers: number[] = []
    timers.push(window.setTimeout(() => setPhase('personas'), reduce ? 0 : 800))
    timers.push(window.setTimeout(() => setPhase('kpis'), reduce ? 0 : 1800))
    timers.push(window.setTimeout(() => setPhase('competitors'), reduce ? 0 : 2800))
    timers.push(window.setTimeout(() => setPhase('complete'), reduce ? 0 : 3800))
    return () => timers.forEach(t => clearTimeout(t))
  }, [reduce, isInView, replayKey])

  const handleReplay = () => {
    setPhase('idea')
    setReplayKey(k => k + 1)
  }

  const card = useMemo(
     () => ({
       initial: { opacity: 0, y: 10, scale: 0.98 },
       enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
     }),
     []
   )
 
   const item = useMemo(
     () => ({
       initial: { opacity: 0, y: 6 },
       enter: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.12 } }),
     }),
     []
   )
 
   return (
    <div ref={containerRef} className="relative mx-auto max-w-6xl">
      <div className="absolute -top-12 right-0">
        <button
          onClick={handleReplay}
          className="p-2 text-gray-500 hover:text-cyan transition-colors"
          title="Replay Animation"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <div className="md:col-span-1">
           <AnimatePresence>
             {phase && (
               <motion.div
                  variants={card}
                  initial="initial"
                  animate="enter"
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="text-xs font-bold text-cyan">Your Idea</div>
                  <div className="mt-2 text-sm text-gray-300">“An Uber for dog walkers”</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:col-span-2">
            <div className="grid gap-6">
              <AnimatePresence>
                {phase !== 'idea' && (
                  <motion.div variants={card} initial="initial" animate="enter" className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="text-xs font-bold text-cyan">Target Audience</div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                     <motion.div custom={0} variants={item} initial="initial" animate="enter" className="rounded-xl border border-white/10 bg-white/5 p-4">
                       <div className="h-8 w-8 rounded-full bg-cyan/20 mb-2" />
                       <div className="text-sm">Busy Buyer</div>
                       <div className="text-xs text-gray-400">Schedules in seconds</div>
                     </motion.div>
                     <motion.div custom={1} variants={item} initial="initial" animate="enter" className="rounded-xl border border-white/10 bg-white/5 p-4">
                       <div className="h-8 w-8 rounded-full bg-cyan/20 mb-2" />
                       <div className="text-sm">Trusted Walker</div>
                       <div className="text-xs text-gray-400">Reliable earnings</div>
                     </motion.div>
                     <motion.div custom={2} variants={item} initial="initial" animate="enter" className="rounded-xl border border-white/10 bg-white/5 p-4">
                       <div className="h-8 w-8 rounded-full bg-cyan/20 mb-2" />
                       <div className="text-sm">City Admin</div>
                       <div className="text-xs text-gray-400">Compliance oversight</div>
                     </motion.div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
 
             <AnimatePresence>
                {phase === 'kpis' || phase === 'competitors' || phase === 'complete' ? (
                  <motion.div variants={card} initial="initial" animate="enter" className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="text-xs font-bold text-cyan">Success Metrics</div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <motion.div custom={0} variants={item} initial="initial" animate="enter" className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                        <div className="text-xs text-gray-400">Retention</div>
                        <div className="text-lg font-bold">42%</div>
                      </motion.div>
                      <motion.div custom={1} variants={item} initial="initial" animate="enter" className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                        <div className="text-xs text-gray-400">Conversion</div>
                        <div className="text-lg font-bold">3.8%</div>
                      </motion.div>
                      <motion.div custom={2} variants={item} initial="initial" animate="enter" className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                        <div className="text-xs text-gray-400">NPS</div>
                        <div className="text-lg font-bold">62</div>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {phase === 'competitors' || phase === 'complete' ? (
                  <motion.div variants={card} initial="initial" animate="enter" className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="text-xs font-bold text-cyan">Market Analysis</div>
                    <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                      <div className="overflow-x-auto">
                        <div className="min-w-[400px]">
                          <div className="grid grid-cols-4 bg-white/5">
                            <div className="p-3 text-xs text-gray-400">Feature</div>
                            <div className="p-3 text-xs text-gray-400">Rover</div>
                            <div className="p-3 text-xs text-gray-400">Wag!</div>
                            <div className="p-3 text-xs text-gray-400">Blueprint</div>
                          </div>
                          <motion.div custom={0} variants={item} initial="initial" animate="enter" className="grid grid-cols-4">
                            <div className="p-3 text-xs border-t border-white/10">Background Checks</div>
                            <div className="p-3 text-xs border-t border-white/10">Yes</div>
                            <div className="p-3 text-xs border-t border-white/10">Yes</div>
                            <div className="p-3 text-xs border-t border-white/10">Enhanced</div>
                          </motion.div>
                          <motion.div custom={1} variants={item} initial="initial" animate="enter" className="grid grid-cols-4">
                            <div className="p-3 text-xs border-t border-white/10">Instant Booking</div>
                            <div className="p-3 text-xs border-t border-white/10">Yes</div>
                            <div className="p-3 text-xs border-t border-white/10">Yes</div>
                            <div className="p-3 text-xs border-t border-white/10">Priority</div>
                          </motion.div>
                          <motion.div custom={2} variants={item} initial="initial" animate="enter" className="grid grid-cols-4">
                            <div className="p-3 text-xs border-t border-white/10">Support Quality</div>
                            <div className="p-3 text-xs border-t border-white/10">Good</div>
                            <div className="p-3 text-xs border-t border-white/10">Good</div>
                            <div className="p-3 text-xs border-t border-white/10">Premium</div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
               ) : null}
             </AnimatePresence>
 
             <AnimatePresence>
               {phase === 'complete' && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1, transition: { duration: 0.6 } }}
                   className="rounded-2xl border border-white/10 bg-white/5 p-5"
                 >
                   <div className="text-xs font-bold text-cyan">Strategic Summary</div>
                   <div className="mt-2 text-sm text-gray-300">Clear personas, measurable KPIs, and market positioning identified.</div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
         </div>
       </div>
     </div>
   )
 }
 
