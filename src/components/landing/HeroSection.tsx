'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HeroAnimation } from './HeroAnimation'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Floating particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 5,
  }))

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center pt-20 pb-20 overflow-hidden">
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-navy via-[#112a45] to-[#0d3b4f] opacity-80"
          animate={{
            background: [
              "linear-gradient(to bottom right, #0B1F33, #112a45, #0d3b4f)",
              "linear-gradient(to bottom right, #0B1F33, #0f2e4a, #1a4d61)",
              "linear-gradient(to bottom right, #0B1F33, #112a45, #0d3b4f)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(46,230,214,0.08)_0%,transparent_60%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {mounted && particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan/20 blur-[1px]"
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`,
              width: p.size,
              height: p.size
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="container relative z-10 px-6 text-center">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight max-w-5xl mx-auto tracking-tight px-2">
            Turn Ideas Into Engineering-Ready Blueprints <span className="text-cyan inline-block">In Minutes</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            BlueprintAI is an AI-powered product manager that transforms rough ideas into clear strategy, visual flows, and developer-ready specifications — without writing a single PRD manually.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto relative group"
          >
            <motion.div
              className="absolute inset-0 bg-cyan rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <Link href="/dashboard" className="relative block bg-cyan text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(46,230,214,0.2)] hover:shadow-[0_0_30px_rgba(46,230,214,0.4)]">
              Start Free — Build Your First Blueprint
            </Link>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto"
          >
            <Link href="#demo" className="block border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:border-white transition-all hover:bg-white/5 backdrop-blur-sm">
              Watch 90-Second Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust/Micro-copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 text-sm text-gray-500 font-medium"
        >
          No credit card required · Built for founders, PMs, and teams
        </motion.p>

        {/* Main Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16"
        >
          <HeroAnimation />
        </motion.div>
      </div>
    </section>
  )
}
