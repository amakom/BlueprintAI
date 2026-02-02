 'use client'
 import { useEffect, useState, useMemo } from 'react'
 import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
 
 type Phase = 'canvas' | 'morph' | 'doc'
 
 export function SpecConversionAnimation() {
   const reduce = useReducedMotion()
   const [phase, setPhase] = useState<Phase>('canvas')
 
   useEffect(() => {
     const t1 = window.setTimeout(() => setPhase('morph'), reduce ? 0 : 1200)
     const t2 = window.setTimeout(() => setPhase('doc'), reduce ? 0 : 2200)
     return () => {
       clearTimeout(t1)
       clearTimeout(t2)
     }
   }, [reduce])
 
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
     <div className="relative mx-auto max-w-6xl">
       <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 p-6">
         <AnimatePresence>
           {phase !== 'doc' && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="relative h-56 rounded-2xl border border-white/10 bg-navy overflow-hidden"
             >
               <div
                 className="absolute inset-0 opacity-[0.12]"
                 style={{
                   backgroundImage:
                     'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                   backgroundSize: '40px 40px',
                 }}
               />
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
                 className="absolute left-28 top-24 w-[140px] h-[52px] rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm"
               >
                 <div className="flex h-full items-center gap-3 px-3">
                   <div className="h-7 w-7 rounded-md bg-cyan/30 flex items-center justify-center text-[10px] text-navy font-bold">UI</div>
                   <div className="flex-1">
                     <div className="text-sm text-white">Search</div>
                     <div className="text-[10px] text-gray-300">Discovery</div>
                   </div>
                 </div>
               </motion.div>
               <motion.div
                 variants={appear}
                 initial="initial"
                 animate="enter"
                 className="absolute left-220 top-60 hidden"
               />
               <motion.div
                 variants={stagger}
                 custom={1}
                 initial="initial"
                 animate="enter"
                 className="absolute left-200 top-16 w-[140px] h-[52px] rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm"
                 style={{ left: 220, top: 80 }}
               >
                 <div className="flex h-full items-center gap-3 px-3">
                   <div className="h-7 w-7 rounded-md bg-cyan/30 flex items-center justify-center text-[10px] text-navy font-bold">ST</div>
                   <div className="flex-1">
                     <div className="text-sm text-white">Story</div>
                     <div className="text-[10px] text-gray-300">User Flow</div>
                   </div>
                 </div>
               </motion.div>
               <motion.div
                 variants={stagger}
                 custom={2}
                 initial="initial"
                 animate="enter"
                 className="absolute left-400 top-28 w-[140px] h-[52px] rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm"
                 style={{ left: 380, top: 120 }}
               >
                 <div className="flex h-full items-center gap-3 px-3">
                   <div className="h-7 w-7 rounded-md bg-cyan/30 flex items-center justify-center text-[10px] text-navy font-bold">DB</div>
                   <div className="flex-1">
                     <div className="text-sm text-white">Data Model</div>
                     <div className="text-[10px] text-gray-300">Entity</div>
                   </div>
                 </div>
               </motion.div>
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
                 className="rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-xs"
               >
                 <div className="text-cyan text-[11px] font-bold mb-2">Database Schema</div>
                 <pre className="text-gray-200">
{`model User {
  id        String  @id @default(cuid())
  email     String  @unique
  createdAt DateTime @default(now())
}
model Booking {
  id        String  @id @default(cuid())
  userId    String
  date      DateTime
}`}
                 </pre>
               </motion.div>
               <motion.div
                 variants={appear}
                 initial="initial"
                 animate="enter"
                 className="rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-xs"
               >
                 <div className="text-cyan text-[11px] font-bold mb-2">API Endpoints</div>
                 <div className="space-y-1 text-gray-200">
                   <div>GET /api/bookings</div>
                   <div>POST /api/bookings</div>
                   <div>POST /api/login</div>
                 </div>
               </motion.div>
               <motion.div
                 variants={appear}
                 initial="initial"
                 animate="enter"
                 className="rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-xs"
               >
                 <div className="text-cyan text-[11px] font-bold mb-2">Frontend Components</div>
                 <div className="space-y-1 text-gray-200">
                   <div>LoginForm</div>
                   <div>BookingList</div>
                   <div>PaymentSummary</div>
                 </div>
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     </div>
   )
 }
 
