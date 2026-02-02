 'use client'
 import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import Link from 'next/link'
import { RotateCcw } from 'lucide-react'

type Phase = 'messy' | 'align' | 'cta'

export function FinalCTAAnimation() {
  const reduce = useReducedMotion()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [phase, setPhase] = useState<Phase>('messy')
  const [replayKey, setReplayKey] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const t1 = window.setTimeout(() => setPhase('align'), reduce ? 0 : 1400)
    const t2 = window.setTimeout(() => setPhase('cta'), reduce ? 0 : 2600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reduce, isInView, replayKey])

  const handleReplay = () => {
    setPhase('messy')
    setReplayKey(k => k + 1)
  }

  const chips = [
    { id: 'idea-1', text: 'Feature creep?', x: '7%', y: 28 },
    { id: 'idea-2', text: 'Target users?', x: '37%', y: 70 },
    { id: 'idea-3', text: 'Tech debt?', x: '20%', y: 140 },
    { id: 'idea-4', text: 'Monetization?', x: '60%', y: 36 },
    { id: 'idea-5', text: 'User flow?', x: '77%', y: 120 },
    { id: 'idea-6', text: 'Database?', x: '50%', y: 180 },
  ]
 
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

      <div className="relative rounded-md overflow-hidden border border-white/10 bg-white/5 p-6">
        <div className="text-center">
          <div className="text-sm font-bold text-cyan">From idea to blueprint</div>
          <div className="mt-1 text-xl font-extrabold text-white">Clarity without the noise</div>
        </div>

        <div className="relative mt-6 h-56 rounded-md border border-white/10 bg-navy overflow-hidden flex items-center justify-center">
          <AnimatePresence>
            {phase !== 'cta' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-full max-w-[600px] h-full">
                  {chips.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        left: phase === 'messy' ? c.x : `${10 + i * 15}%`,
                        top: phase === 'messy' ? c.y : 70 + (i % 2) * 60,
                        transition: { duration: 0.5, delay: i * 0.08 },
                      }}
                      className="absolute rounded-md border border-white/10 bg-white/10 text-white text-xs px-3 py-1 backdrop-blur-sm whitespace-nowrap"
                    >
                      {c.text}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
 
           <AnimatePresence>
             {phase === 'cta' && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1, transition: { duration: 0.6 } }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 flex items-center justify-center"
               >
                 <motion.div
                  initial={{ scale: 0.98, y: 8 }}
                  animate={{ scale: 1, y: 0, transition: { duration: 0.5 } }}
                  className="w-full max-w-2xl rounded-md border border-white/10 bg-white/5 p-6 text-center"
                >
                  <div className="text-sm font-bold text-cyan">Your Product Plan</div>
                   <div className="mt-2 text-2xl font-extrabold text-white">Everything connected and ready</div>
                   <div className="mt-3 text-sm text-gray-300">Strategy, flows, and specs unified.</div>
                   <div className="mt-6 flex items-center justify-center gap-4">
                     <Link href="/dashboard" className="bg-cyan text-navy px-6 py-2 rounded-md font-bold hover:bg-cyan/90 transition-colors">
                      Start Building for Free
                    </Link>
                   </div>
                 </motion.div>
               </motion.div>
             )}
           </AnimatePresence>
         </div>
       </div>
     </div>
   )
 }
 
