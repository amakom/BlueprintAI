 'use client'
 import { useMemo } from 'react'
 import { motion, AnimatePresence } from 'framer-motion'
 
 type PlanKey = 'FREE' | 'PRO' | 'TEAM'
 
 interface PricingPreviewProps {
   selected?: PlanKey
 }
 
 export function PricingPreview({ selected = 'FREE' }: PricingPreviewProps) {
   const variants = useMemo(
     () => ({
       panel: {
         initial: { opacity: 0, y: 8, scale: 0.98 },
         enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
       },
       item: {
         initial: { opacity: 0, y: 6 },
         enter: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.12 } }),
       },
     }),
     []
   )
 
   const Gauge = ({ level }: { level: 1 | 2 | 3 }) => (
     <div className="mt-3 flex items-center gap-1">
       {[0, 1, 2].map((i) => (
         <motion.div
           key={i}
           initial={{ opacity: 0, width: 0 }}
           animate={{ opacity: i < level ? 1 : 0.25, width: i < level ? 28 : 16, transition: { duration: 0.4, delay: i * 0.08 } }}
           className="h-2 rounded-sm bg-cyan/70"
         />
       ))}
     </div>
   )
 
   const Cursors = () => (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div initial={{ opacity: 0, x: -6, y: 4 }} animate={{ opacity: 1, x: 0, y: 0, transition: { duration: 0.4, delay: 0.1 } }} className="absolute left-10 top-6 h-4 w-4 rounded-md bg-amber" />
      <motion.div initial={{ opacity: 0, x: 6, y: -4 }} animate={{ opacity: 1, x: 0, y: 0, transition: { duration: 0.4, delay: 0.2 } }} className="absolute left-24 top-16 h-4 w-4 rounded-md bg-cyan" />
      <motion.div initial={{ opacity: 0, x: -4, y: 6 }} animate={{ opacity: 1, x: 0, y: 0, transition: { duration: 0.4, delay: 0.3 } }} className="absolute left-44 top-10 h-4 w-4 rounded-md bg-white/80" />
    </div>
  )
 
   return (
     <div className="mt-12">
      <motion.div variants={variants.panel} initial="initial" animate="enter" className="relative rounded-md border border-border bg-white p-5">
        <div className="text-sm font-bold text-navy">Plan Preview</div>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <motion.div variants={variants.item} custom={0} initial="initial" animate="enter" className="relative rounded-md border border-border bg-cloud p-4">
            <div className="text-xs text-gray-500">Canvas</div>
            <div className="mt-2 h-28 rounded-md border border-border bg-white relative overflow-hidden">
              {selected === 'FREE' && (
                 <AnimatePresence>
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/70" />
                 </AnimatePresence>
               )}
               {selected !== 'FREE' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
               )}
               {selected === 'TEAM' && <Cursors />}
             </div>
             <div className="mt-2 text-[11px] text-gray-500">
               {selected === 'FREE' && 'Limited area'}
               {selected === 'PRO' && 'Unlimited canvas'}
               {selected === 'TEAM' && 'Shared editing + cursors'}
             </div>
           </motion.div>
 
           <motion.div variants={variants.item} custom={1} initial="initial" animate="enter" className="rounded-md border border-border bg-cloud p-4">
            <div className="text-xs text-gray-500">AI Generation</div>
            <div className="mt-2 h-28 rounded-md border border-border bg-white p-3">
              <div className="text-[11px] text-gray-500">Capacity</div>
               <Gauge level={selected === 'FREE' ? 1 : selected === 'PRO' ? 2 : 3} />
             </div>
             <div className="mt-2 text-[11px] text-gray-500">
               {selected === 'FREE' && 'Capped usage'}
               {selected === 'PRO' && 'Higher quota'}
               {selected === 'TEAM' && 'Team-level capacity'}
             </div>
           </motion.div>
 
           <motion.div variants={variants.item} custom={2} initial="initial" animate="enter" className="rounded-md border border-border bg-cloud p-4">
            <div className="text-xs text-gray-500">Collaboration</div>
            <div className="mt-2 h-28 rounded-md border border-border bg-white p-3 relative">
              <div className="text-[11px] text-gray-500">Presence</div>
              <div className="mt-3 flex items-center gap-2">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: selected === 'TEAM' ? 1 : 0.25 }} className="h-6 w-6 rounded-md bg-amber" />
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: selected === 'TEAM' ? 1 : 0.25 }} className="h-6 w-6 rounded-md bg-cyan" />
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: selected === 'TEAM' ? 1 : 0.25 }} className="h-6 w-6 rounded-md bg-gray-400" />
               </div>
             </div>
             <div className="mt-2 text-[11px] text-gray-500">
               {selected === 'TEAM' ? 'Live cursors + shared edits' : 'Solo only'}
             </div>
           </motion.div>
         </div>
       </motion.div>
     </div>
   )
 }
 
