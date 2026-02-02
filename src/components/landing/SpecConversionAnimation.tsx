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
    const t1 = window.setTimeout(() => setPhase('morph'), reduce ? 0 : 1200)
    const t2 = window.setTimeout(() => setPhase('doc'), reduce ? 0 : 2200)
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
       enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
     }),
     []
   )
 
   const stagger = useMemo(
     () => ({
       initial: { opacity: 0, y: 8 },
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

      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 p-6">
        <AnimatePresence>
          {phase !== 'doc' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-56 rounded-2xl border border-white/10 bg-navy overflow-hidden flex items-center justify-center"
            >
              <div className="relative w-full max-w-[600px] h-full">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
                  className="absolute top-4 left-4 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white"
                >
                  Product Canvas
                </motion.div>
                <motion.div
                  variants={appear}
                  initial="initial"
                  animate="enter"
                  className="absolute w-[140px] h-[52px] rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm overflow-hidden"
                  style={{ left: 70, top: 86 }}
                >
                  <div className="flex h-full items-center gap-3 px-3">
                    <div className="h-7 w-7 rounded-md bg-cyan/30 flex items-center justify-center text-[10px] text-navy font-bold flex-shrink-0">UI</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">Search</div>
                      <div className="text-[10px] text-gray-300 truncate">Discovery</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  variants={stagger}
                  custom={1}
                  initial="initial"
                  animate="enter"
                  className="absolute w-[140px] h-[52px] rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm overflow-hidden"
                  style={{ left: 230, top: 86 }}
                >
                  <div className="flex h-full items-center gap-3 px-3">
                    <div className="h-7 w-7 rounded-md bg-cyan/30 flex items-center justify-center text-[10px] text-navy font-bold flex-shrink-0">ST</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">Story</div>
                      <div className="text-[10px] text-gray-300 truncate">User Flow</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  variants={stagger}
                  custom={2}
                  initial="initial"
                  animate="enter"
                  className="absolute w-[140px] h-[52px] rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm overflow-hidden"
                  style={{ left: 390, top: 86 }}
                >
                  <div className="flex h-full items-center gap-3 px-3">
                    <div className="h-7 w-7 rounded-md bg-cyan/30 flex items-center justify-center text-[10px] text-navy font-bold flex-shrink-0">DB</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">Data Model</div>
                      <div className="text-[10px] text-gray-300 truncate">Entity</div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <AnimatePresence>
                {phase === 'morph' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: 0.94, transition: { duration: 0.6 } }}
                      className="absolute inset-0"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
         </AnimatePresence>
 
         <AnimatePresence>
           {phase === 'doc' && (
             <motion.div
               initial={{ opacity: 0, y: 12 }}
               animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
               exit={{ opacity: 0 }}
               className="mt-4 grid md:grid-cols-3 gap-4"
             >
               <motion.div
                variants={appear}
                initial="initial"
                animate="enter"
                className="rounded-2xl border border-white/10 bg-white/5 p-3 font-mono text-[10px] overflow-hidden"
              >
                <div className="text-cyan text-[10px] font-bold mb-2 truncate">Data Model (Prisma)</div>
                <pre className="text-gray-300 leading-tight scrollbar-none overflow-x-auto">
{`model User {
  id    String @id @default(cuid())
  email String @unique
  created DateTime @default(now())
}
model Booking {
  id     String @id @default(cuid())
  userId String
  date   DateTime
}`}
                </pre>
              </motion.div>
              <motion.div
                variants={appear}
                initial="initial"
                animate="enter"
                className="rounded-2xl border border-white/10 bg-white/5 p-3 font-mono text-[10px] overflow-hidden"
              >
                <div className="text-cyan text-[10px] font-bold mb-2 truncate">API Routes (Next.js)</div>
                <div className="space-y-2 text-gray-300">
                  <div className="truncate">GET  /api/bookings</div>
                  <div className="truncate">POST /api/bookings</div>
                  <div className="truncate">POST /api/login</div>
                </div>
              </motion.div>
              <motion.div
                variants={appear}
                initial="initial"
                animate="enter"
                className="rounded-2xl border border-white/10 bg-white/5 p-3 font-mono text-[10px] overflow-hidden"
              >
                <div className="text-cyan text-[10px] font-bold mb-2 truncate">UI Components (React)</div>
                <div className="space-y-2 text-gray-300">
                  <div className="truncate">LoginForm</div>
                  <div className="truncate">BookingList</div>
                  <div className="truncate">PaymentSummary</div>
                </div>
              </motion.div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     </div>
   )
 }
 
