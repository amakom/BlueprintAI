 'use client'
 import { useEffect, useMemo, useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'

export function HeroAnimation() {
  const reduce = useReducedMotion()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'typing' | 'streams' | 'merge'>('typing')
  const target = 'An Uber for dog walkers'

  useEffect(() => {
    if (!isInView || phase !== 'typing') return
    let i = 0
     const interval = setInterval(() => {
       i += 1
       setTyped(target.slice(0, i))
       if (i >= target.length) {
         clearInterval(interval)
         setTimeout(() => setPhase('streams'), 700)
       }
     }, reduce ? 0 : 60)
     return () => clearInterval(interval)
   }, [phase, reduce, isInView])
 
   useEffect(() => {
     if (phase !== 'streams') return
     const t = setTimeout(() => setPhase('merge'), reduce ? 0 : 2800)
     return () => clearTimeout(t)
   }, [phase, reduce])
 
   const streamVariants = useMemo(
     () => ({
       initial: { opacity: 0, y: 12, scale: 0.96 },
       enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
     }),
     []
   )
 
   const blockVariants = useMemo(
     () => ({
       initial: { opacity: 0, y: 10 },
       enter: (i: number) => ({
         opacity: 1,
         y: 0,
         transition: { duration: 0.4, delay: i * 0.12 },
       }),
     }),
     []
   )
 
   return (
    <div ref={containerRef} className="relative mx-auto max-w-6xl">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
         <div className="flex items-center gap-3">
           <div className="h-6 w-6 rounded-md bg-cyan/80 text-navy flex items-center justify-center text-xs font-bold">AI</div>
           <div className="flex-1">
             <div className="font-mono text-lg text-white">
               <span>{typed}</span>
               <span className="inline-block w-px h-6 align-[-4px] bg-cyan animate-[pulse_1s_ease-in-out_infinite]"></span>
             </div>
           </div>
         </div>
       </div>
 
       <AnimatePresence>
         {phase !== 'typing' && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.6 }}
             className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
           >
             <motion.div
               variants={streamVariants}
               initial="initial"
               animate="enter"
               className="rounded-2xl border border-white/10 bg-white/5 p-4"
             >
               <div className="text-xs font-bold text-cyan">Strategy</div>
               <div className="mt-3 space-y-3">
                 <motion.div
                   custom={0}
                   variants={blockVariants}
                   initial="initial"
                   animate="enter"
                   className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                 >
                   <div className="h-8 w-8 rounded-full bg-cyan/20" />
                   <div className="flex-1">
                     <div className="text-sm">Persona: Busy Buyer</div>
                     <div className="text-xs text-gray-400">Needs quick scheduling</div>
                   </div>
                 </motion.div>
                 <motion.div
                   custom={1}
                   variants={blockVariants}
                   initial="initial"
                   animate="enter"
                   className="grid grid-cols-3 gap-2"
                 >
                   <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
                     <div className="text-xs text-gray-400">KPI</div>
                     <div className="text-sm font-bold">D7 Ret</div>
                   </div>
                   <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
                     <div className="text-xs text-gray-400">KPI</div>
                     <div className="text-sm font-bold">Conv%</div>
                   </div>
                   <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
                     <div className="text-xs text-gray-400">KPI</div>
                     <div className="text-sm font-bold">NPS</div>
                   </div>
                 </motion.div>
                 <motion.div
                   custom={2}
                   variants={blockVariants}
                   initial="initial"
                   animate="enter"
                   className="rounded-xl border border-white/10 bg-white/5 p-3"
                 >
                   <div className="text-sm">Competitors</div>
                   <div className="mt-2 grid grid-cols-3 gap-2">
                     <div className="rounded-md border border-white/10 bg-white/5 p-2 text-xs">Rover</div>
                     <div className="rounded-md border border-white/10 bg-white/5 p-2 text-xs">Wag!</div>
                     <div className="rounded-md border border-white/10 bg-white/5 p-2 text-xs">Local</div>
                   </div>
                 </motion.div>
               </div>
             </motion.div>
 
             <motion.div
               variants={streamVariants}
               initial="initial"
               animate="enter"
               className="rounded-2xl border border-white/10 bg-white/5 p-4"
             >
               <div className="text-xs font-bold text-cyan">Visual Canvas</div>
               <div className="mt-3 relative h-40">
                 <motion.div
                   custom={0}
                   variants={blockVariants}
                   initial="initial"
                   animate="enter"
                   className="absolute left-2 top-2 h-10 w-28 rounded-md border border-white/10 bg-white/5 flex items-center justify-center text-xs"
                 >
                   Login
                 </motion.div>
                 <motion.div
                   custom={1}
                   variants={blockVariants}
                   initial="initial"
                   animate="enter"
                   className="absolute left-40 top-10 h-10 w-28 rounded-md border border-white/10 bg-white/5 flex items-center justify-center text-xs"
                 >
                   Dashboard
                 </motion.div>
                 <motion.div
                   custom={2}
                   variants={blockVariants}
                   initial="initial"
                   animate="enter"
                   className="absolute left-24 top-28 h-10 w-28 rounded-md border border-white/10 bg-white/5 flex items-center justify-center text-xs"
                 >
                   Reset
                 </motion.div>
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1, transition: { delay: 0.6 } }}
                   className="absolute left-28 top-12 h-px w-12 bg-white/20"
                 />
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1, transition: { delay: 0.8 } }}
                   className="absolute left-16 top-28 h-px w-16 bg-white/20"
                 />
               </div>
             </motion.div>
 
             <motion.div
               variants={streamVariants}
               initial="initial"
               animate="enter"
               className="rounded-2xl border border-white/10 bg-white/5 p-4"
             >
               <div className="text-xs font-bold text-cyan">Engineering Spec</div>
               <div className="mt-3 space-y-2 font-mono">
                 <motion.div
                   custom={0}
                   variants={blockVariants}
                   initial="initial"
                   animate="enter"
                   className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs"
                 >
                   model User {`{`} id String, email String {`}`}
                 </motion.div>
                 <motion.div
                   custom={1}
                   variants={blockVariants}
                   initial="initial"
                   animate="enter"
                   className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs"
                 >
                   POST /api/login
                 </motion.div>
                 <motion.div
                   custom={2}
                   variants={blockVariants}
                   initial="initial"
                   animate="enter"
                   className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs"
                 >
                   GET /api/bookings
                 </motion.div>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
 
       <AnimatePresence>
         {phase === 'merge' && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="mt-10 flex items-center justify-center"
           >
             <motion.div
               initial={{ scale: 0.96, y: 8 }}
               animate={{ scale: 1, y: 0, transition: { duration: 0.5 } }}
               className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6"
             >
               <div className="text-center">
                 <div className="text-sm font-bold text-cyan">Product Blueprint</div>
                 <div className="mt-2 text-2xl font-extrabold text-white">Strategy × Canvas × Spec</div>
                 <div className="mt-3 text-sm text-gray-400">Unified, developer-ready output</div>
               </div>
               <div className="mt-6 grid grid-cols-3 gap-3">
                 <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs">
                   Personas, KPIs, Market
                 </div>
                 <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs">
                   Flow, Screens, Stories
                 </div>
                 <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs">
                   Models, APIs, Contracts
                 </div>
               </div>
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{
                   opacity: 1,
                   boxShadow: '0 0 0.75rem rgba(46, 230, 214, 0.25)',
                   transition: { duration: 0.8, delay: 0.2 },
                 }}
                 className="pointer-events-none absolute inset-0 rounded-3xl"
               />
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   )
 }
 
