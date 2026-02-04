'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

type Phase = 'blank' | 'prompt' | 'nodes' | 'edges'

export function CanvasFlowAnimation() {
  const reduce = useReducedMotion()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [phase, setPhase] = useState<Phase>('blank')
  const [replayKey, setReplayKey] = useState(0)

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
  }, [reduce, isInView, replayKey])

  const handleReplay = () => {
    setPhase('blank')
    setReplayKey(k => k + 1)
  }

  const nodes = [
    { id: 'login', label: 'Login Screen', tag: 'Auth', x: 30, y: 60, color: '#3B82F6' },
    { id: 'search', label: 'Search & Browse', tag: 'Discovery', x: 200, y: 120, color: '#10B981' },
    { id: 'booking', label: 'Book a Walker', tag: 'Core Flow', x: 370, y: 60, color: '#F59E0B' },
    { id: 'payment', label: 'Checkout', tag: 'Payment', x: 540, y: 120, color: '#EF4444' },
  ]

  const edges = [
    { from: 'login', to: 'search' },
    { from: 'search', to: 'booking' },
    { from: 'booking', to: 'payment' },
  ]

  const center = (id: string) => {
    const n = nodes.find(n => n.id === id)
    if (!n) return { cx: 0, cy: 0 }
    return { cx: n.x + 70, cy: n.y + 30 }
  }

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

      <div className="rounded-md border border-white/10 bg-navy overflow-hidden">
        {/* Canvas Toolbar */}
        <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-3 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
          </div>
          <div className="text-[10px] text-gray-500 ml-2 font-mono">BlueprintAI Canvas</div>
          <div className="ml-auto flex gap-2 text-[9px] text-gray-500">
            <span className="px-1.5 py-0.5 bg-white/5 rounded text-cyan font-bold">Canvas</span>
            <span className="px-1.5 py-0.5">Strategy</span>
            <span className="px-1.5 py-0.5">Specs</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="relative h-72 min-w-[700px] flex items-center justify-center">
            {/* Dot Grid Background */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            <AnimatePresence>
              {phase !== 'blank' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-3 left-1/2 -translate-x-1/2 z-10"
                >
                  <div className="rounded-md border border-cyan/30 bg-cyan/10 px-4 py-1.5 text-xs text-cyan font-medium flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
                    </div>
                    &quot;Build a dog walking booking app&quot;
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative w-full max-w-[700px] h-full">
              {/* Edge SVG Layer */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 300" preserveAspectRatio="none">
                <AnimatePresence>
                  {phase === 'edges' &&
                    edges.map((e, i) => {
                      const a = center(e.from)
                      const b = center(e.to)
                      const midX = (a.cx + b.cx) / 2
                      return (
                        <g key={`${e.from}-${e.to}`}>
                          <motion.path
                            d={`M ${a.cx} ${a.cy} C ${midX} ${a.cy}, ${midX} ${b.cy}, ${b.cx} ${b.cy}`}
                            fill="none"
                            stroke="#2EE6D6"
                            strokeWidth="2"
                            strokeDasharray="6 4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                              pathLength: 1,
                              opacity: 0.7,
                              strokeDashoffset: [0, -20]
                            }}
                            transition={{
                              pathLength: { duration: 0.8, delay: i * 0.15, ease: "easeInOut" },
                              opacity: { duration: 0.4, delay: i * 0.15 },
                              strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" }
                            }}
                          />
                          {/* Arrow head */}
                          <motion.circle
                            cx={b.cx}
                            cy={b.cy}
                            r="3"
                            fill="#2EE6D6"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.8 }}
                            transition={{ delay: i * 0.15 + 0.6 }}
                          />
                        </g>
                      )
                    })}
                </AnimatePresence>
              </svg>

              <AnimatePresence>
                {(phase === 'nodes' || phase === 'edges') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    {nodes.map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 12, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
                        }}
                        className="absolute w-[140px] rounded-md border border-white/15 bg-white/8 backdrop-blur-sm overflow-hidden shadow-lg shadow-black/20"
                        style={{ left: n.x, top: n.y }}
                      >
                        {/* Node Header */}
                        <div className="h-6 flex items-center px-2 gap-1.5 border-b border-white/10" style={{ backgroundColor: `${n.color}15` }}>
                          <div className="w-3 h-3 rounded-sm flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: `${n.color}30`, color: n.color }}>
                            {n.tag.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-[9px] font-medium truncate" style={{ color: n.color }}>{n.tag}</span>
                        </div>
                        {/* Node Body */}
                        <div className="px-2 py-2">
                          <div className="text-xs text-white font-medium truncate">{n.label}</div>
                          <div className="mt-1 flex gap-1">
                            <div className="h-1 flex-1 rounded-full bg-white/10" />
                            <div className="h-1 w-6 rounded-full bg-white/10" />
                          </div>
                        </div>
                        {/* Connection handles */}
                        <motion.div
                          className="absolute top-1/2 -right-1 w-2 h-2 rounded-full bg-cyan border border-cyan/50 -translate-y-1/2"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        />
                        <div className="absolute top-1/2 -left-1 w-2 h-2 rounded-full bg-white/30 border border-white/20 -translate-y-1/2" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
