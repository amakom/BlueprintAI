 'use client'
 import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'

type Phase = 'blank' | 'prompt' | 'nodes' | 'edges'

export function CanvasFlowAnimation() {
  const reduce = useReducedMotion()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [phase, setPhase] = useState<Phase>('blank')

  useEffect(() => {
    if (!isInView) return
    const t1 = window.setTimeout(() => setPhase('prompt'), reduce ? 0 : 600)
     const t2 = window.setTimeout(() => setPhase('nodes'), reduce ? 0 : 1400)
     const t3 = window.setTimeout(() => setPhase('edges'), reduce ? 0 : 2400)
     return () => {
       clearTimeout(t1)
       clearTimeout(t2)
       clearTimeout(t3)
     }
   }, [reduce])
 
   const nodes = [
     { id: 'login', label: 'Login', tag: 'Auth', x: 60, y: 40 },
     { id: 'search', label: 'Search', tag: 'Discovery', x: 220, y: 90 },
     { id: 'booking', label: 'Booking', tag: 'Flow', x: 380, y: 40 },
     { id: 'payment', label: 'Payment', tag: 'Checkout', x: 540, y: 90 },
   ]
 
   const edges = [
     { from: 'login', to: 'search' },
     { from: 'search', to: 'booking' },
     { from: 'booking', to: 'payment' },
   ]
 
   const center = (id: string) => {
     const n = nodes.find(n => n.id === id)!
     return { cx: n.x + 70, cy: n.y + 26 }
   }
 
   return (
    <div ref={containerRef} className="relative mx-auto max-w-6xl">
      <div className="relative h-72 rounded-3xl overflow-hidden border border-white/10 bg-navy flex items-center justify-center">
        <AnimatePresence>
          {phase !== 'blank' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
            >
              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">
                Create a booking flow
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full max-w-[700px] h-full">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 300" preserveAspectRatio="none">
            <AnimatePresence>
              {phase === 'edges' &&
                edges.map((e, i) => {
                  const a = center(e.from)
                  const b = center(e.to)
                  return (
                    <motion.line
                      key={`${e.from}-${e.to}`}
                      x1={a.cx}
                      y1={a.cy}
                      x2={b.cx}
                      y2={b.cy}
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.4, delay: i * 0.12 } }}
                    />
                  )
                })}
            </AnimatePresence>
          </svg>

          <AnimatePresence>
            {phase === 'nodes' || phase === 'edges' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {nodes.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, delay: i * 0.12 } }}
                    className="absolute w-[140px] h-[52px] rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm"
                    style={{ left: n.x, top: n.y }}
                  >
                    <div className="flex h-full items-center gap-3 px-3">
                      <div className="h-7 w-7 rounded-md bg-cyan/30 flex items-center justify-center text-[10px] text-navy font-bold">
                        {n.tag.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white">{n.label}</div>
                        <div className="text-[10px] text-gray-300">{n.tag}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
 
