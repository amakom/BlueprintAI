'use client'
import { useEffect, useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

type Phase = 'canvas' | 'morph' | 'doc'

export function SpecConversionAnimation() {
  const reduce = useReducedMotion()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [phase, setPhase] = useState<Phase>('canvas')
  const [replayKey, setReplayKey] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const t1 = window.setTimeout(() => setPhase('morph'), reduce ? 0 : 1500)
    const t2 = window.setTimeout(() => setPhase('doc'), reduce ? 0 : 2800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reduce, isInView, replayKey])

  const handleReplay = () => {
    setPhase('canvas')
    setReplayKey(k => k + 1)
  }

  const appear = useMemo(
    () => ({
      initial: { opacity: 0, y: 10, scale: 0.98 },
      enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    }),
    []
  )

  const stagger = useMemo(
    () => ({
      initial: { opacity: 0, y: 8 },
      enter: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] } }),
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

      <div className="relative rounded-md overflow-hidden border border-white/10 bg-white/5 p-6">
        {/* Phase Label */}
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] uppercase tracking-wider font-bold text-cyan"
          >
            {phase === 'canvas' && 'Visual Canvas'}
            {phase === 'morph' && 'Analyzing...'}
            {phase === 'doc' && 'Engineering Spec Generated'}
          </motion.div>
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full transition-colors ${phase === 'canvas' ? 'bg-cyan' : 'bg-white/20'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${phase === 'morph' ? 'bg-cyan' : 'bg-white/20'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${phase === 'doc' ? 'bg-cyan' : 'bg-white/20'}`} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase !== 'doc' && (
            <motion.div
              key="canvas-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)', transition: { duration: 0.4 } }}
              className="relative h-56 rounded-md border border-white/10 bg-navy overflow-hidden"
            >
              {/* Dot Grid */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                  backgroundSize: '18px 18px'
                }}
              />

              <div className="overflow-x-auto h-full">
                <div className="relative min-w-[600px] h-full mx-auto">
                  {/* Canvas Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
                    className="absolute top-3 left-3 flex items-center gap-2"
                  >
                    <div className="rounded-md border border-cyan/30 bg-cyan/10 px-3 py-1 text-[10px] text-cyan font-bold">
                      Product Canvas
                    </div>
                  </motion.div>

                  {/* Canvas Nodes */}
                  <motion.div
                    variants={appear}
                    initial="initial"
                    animate="enter"
                    className="absolute w-[130px] rounded-md border border-blue-400/30 bg-blue-400/10 overflow-hidden"
                    style={{ left: 60, top: 70 }}
                  >
                    <div className="h-5 bg-blue-400/20 flex items-center px-2">
                      <span className="text-[8px] font-bold text-blue-400">SCREEN</span>
                    </div>
                    <div className="px-2 py-1.5">
                      <div className="text-xs text-white font-medium">Search</div>
                      <div className="text-[9px] text-gray-400">Discovery flow</div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={stagger}
                    custom={1}
                    initial="initial"
                    animate="enter"
                    className="absolute w-[130px] rounded-md border border-amber-400/30 bg-amber-400/10 overflow-hidden"
                    style={{ left: 230, top: 70 }}
                  >
                    <div className="h-5 bg-amber-400/20 flex items-center px-2">
                      <span className="text-[8px] font-bold text-amber-400">USER STORY</span>
                    </div>
                    <div className="px-2 py-1.5">
                      <div className="text-xs text-white font-medium">Book Walker</div>
                      <div className="text-[9px] text-gray-400">Core user flow</div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={stagger}
                    custom={2}
                    initial="initial"
                    animate="enter"
                    className="absolute w-[130px] rounded-md border border-emerald-400/30 bg-emerald-400/10 overflow-hidden"
                    style={{ left: 400, top: 70 }}
                  >
                    <div className="h-5 bg-emerald-400/20 flex items-center px-2">
                      <span className="text-[8px] font-bold text-emerald-400">DATA MODEL</span>
                    </div>
                    <div className="px-2 py-1.5">
                      <div className="text-xs text-white font-medium">Booking</div>
                      <div className="text-[9px] text-gray-400">Entity schema</div>
                    </div>
                  </motion.div>

                  {/* Edge connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path
                      d="M 190 91 C 210 91, 210 91, 230 91"
                      fill="none" stroke="#2EE6D6" strokeWidth="1.5" strokeDasharray="4 3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.5, strokeDashoffset: [0, -14] }}
                      transition={{ pathLength: { duration: 0.6, delay: 0.8 }, opacity: { duration: 0.3, delay: 0.8 }, strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" } }}
                    />
                    <motion.path
                      d="M 360 91 C 380 91, 380 91, 400 91"
                      fill="none" stroke="#2EE6D6" strokeWidth="1.5" strokeDasharray="4 3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.5, strokeDashoffset: [0, -14] }}
                      transition={{ pathLength: { duration: 0.6, delay: 1.0 }, opacity: { duration: 0.3, delay: 1.0 }, strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" } }}
                    />
                  </svg>

                  {/* Morph overlay */}
                  <AnimatePresence>
                    {phase === 'morph' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-navy/60 backdrop-blur-[2px] flex items-center justify-center z-10"
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center"
                        >
                          <motion.div
                            className="w-10 h-10 border-2 border-cyan border-t-transparent rounded-full mx-auto mb-3"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <div className="text-xs text-cyan font-bold">Generating Engineering Spec...</div>
                          <div className="text-[10px] text-gray-400 mt-1">Reading canvas nodes & strategy</div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'doc' && (
            <motion.div
              key="doc-view"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-3 gap-4"
            >
              {/* Prisma Schema */}
              <motion.div
                variants={appear}
                initial="initial"
                animate="enter"
                className="rounded-md border border-white/10 bg-navy/80 overflow-hidden"
              >
                <div className="h-7 bg-emerald-500/10 border-b border-white/10 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[9px] font-bold text-emerald-400">schema.prisma</span>
                </div>
                <pre className="p-3 text-[10px] text-gray-300 leading-relaxed font-mono overflow-x-auto scrollbar-none">
{`model User {
  id      String   @id @default(cuid())
  email   String   @unique
  name    String?
  created DateTime @default(now())
}

model Booking {
  id       String   @id @default(cuid())
  userId   String
  walkerId String
  date     DateTime
  status   String   @default("pending")
}`}
                </pre>
              </motion.div>

              {/* API Routes */}
              <motion.div
                variants={stagger}
                custom={1}
                initial="initial"
                animate="enter"
                className="rounded-md border border-white/10 bg-navy/80 overflow-hidden"
              >
                <div className="h-7 bg-blue-500/10 border-b border-white/10 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-[9px] font-bold text-blue-400">API Routes</span>
                </div>
                <div className="p-3 space-y-2 font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-[8px] font-bold">GET</span>
                    <span className="text-gray-300">/api/bookings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[8px] font-bold">POST</span>
                    <span className="text-gray-300">/api/bookings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[8px] font-bold">POST</span>
                    <span className="text-gray-300">/api/auth/login</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[8px] font-bold">PUT</span>
                    <span className="text-gray-300">/api/bookings/:id</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[8px] font-bold">DEL</span>
                    <span className="text-gray-300">/api/bookings/:id</span>
                  </div>
                </div>
              </motion.div>

              {/* Screen Components */}
              <motion.div
                variants={stagger}
                custom={2}
                initial="initial"
                animate="enter"
                className="rounded-md border border-white/10 bg-navy/80 overflow-hidden"
              >
                <div className="h-7 bg-purple-500/10 border-b border-white/10 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-[9px] font-bold text-purple-400">Components</span>
                </div>
                <div className="p-3 space-y-2 font-mono text-[10px]">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-purple-400">&lt;</span>LoginForm<span className="text-purple-400"> /&gt;</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-purple-400">&lt;</span>SearchWalkers<span className="text-purple-400"> /&gt;</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-purple-400">&lt;</span>BookingForm<span className="text-purple-400"> /&gt;</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-purple-400">&lt;</span>BookingList<span className="text-purple-400"> /&gt;</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-purple-400">&lt;</span>PaymentSummary<span className="text-purple-400"> /&gt;</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
