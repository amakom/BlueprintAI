'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function InteractiveCanvasNodeAnimation() {
  const [key, setKey] = useState(0)

  // Restart loop every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setKey(k => k + 1)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  const cyan = '#2EE6D6'
  const navy = '#0B1F33'
  const white = '#ffffff'
  const gray = '#94a3b8'

  return (
    <div className="h-40 w-full relative mb-6 overflow-hidden rounded-xl bg-navy/50 border border-white/10 flex items-center justify-center">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(${gray} 1px, transparent 1px)`,
          backgroundSize: '16px 16px'
        }}
      />

      {/* SVG for Connection Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.line
          key={`line-${key}`}
          x1="35%" y1="50%"
          x2="65%" y2="50%"
          stroke={cyan}
          strokeWidth="2"
          strokeDasharray="100"
          strokeDashoffset="100"
          initial={{ strokeDashoffset: 100, opacity: 0 }}
          animate={{ 
            strokeDashoffset: 0, 
            opacity: 1,
            transition: { delay: 1.5, duration: 1, ease: "easeInOut" }
          }}
        />
      </svg>

      {/* Node 1 (Left) */}
      <motion.div
        key={`node1-${key}`}
        className="absolute left-[35%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-cyan rounded-lg flex items-center justify-center z-10 shadow-lg shadow-cyan/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1, 1.1, 1], 
          opacity: 1,
          borderColor: [cyan, white, cyan],
        }}
        transition={{ 
          duration: 4,
          times: [0, 0.2, 0.5, 1],
          ease: "easeOut"
        }}
      >
        <div className="w-6 h-1 bg-cyan/50 rounded-full" />
      </motion.div>

      {/* Node 2 (Right) */}
      <motion.div
        key={`node2-${key}`}
        className="absolute left-[65%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-navy border border-white/20 rounded-lg flex items-center justify-center z-10"
        initial={{ scale: 0, opacity: 0, x: -20 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          x: '-50%', // Reset transform
          borderColor: [white, cyan, white]
        }}
        transition={{ 
          delay: 2, 
          duration: 0.5,
          borderColor: { delay: 2.5, duration: 2, repeat: Infinity, repeatType: "reverse" }
        }}
      >
        <motion.div 
          className="w-2 h-2 bg-cyan rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Cursor Interaction Simulation */}
      <motion.div
        key={`cursor-${key}`}
        className="absolute w-4 h-4 text-white z-20"
        initial={{ x: "35%", y: "80%", opacity: 0 }}
        animate={{ 
          x: ["35%", "35%", "65%", "65%"],
          y: ["80%", "50%", "50%", "80%"],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 3,
          times: [0, 0.2, 0.8, 1],
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-md">
          <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19169L11.1114 12.3673H5.65376Z" />
        </svg>
      </motion.div>

    </div>
  )
}
