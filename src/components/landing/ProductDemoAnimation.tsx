'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layout,
  Plus,
  Settings,
  Home,
  Folder,
  Users,
  LogOut,
  ChevronRight,
  Smartphone,
  Globe,
  Box,
  X,
  Sparkles,
  Send,
  Share2,
  User,
  PanelRight,
  MousePointer2
} from 'lucide-react'

export function ProductDemoAnimation() {
  const [step, setStep] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // Animation State
  const [cursorPos, setCursorPos] = useState({ x: '50%', y: '50%' })
  const [isClicking, setIsClicking] = useState(false)
  const [glowTarget, setGlowTarget] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [aiInput, setAiInput] = useState('')
  const [canvasNodes, setCanvasNodes] = useState<boolean>(false)

  const [isMobile, setIsMobile] = useState(false)

  // Constants
  const NAME_TEXT = "Monra"
  const DESC_TEXT = "P2P Crypto Exchange"
  const AI_PROMPT = "Generate user stories for login"

  const BASE_WIDTH = isMobile ? 600 : 1200
  const BASE_HEIGHT = 750

  // Glow helper - returns conditional glow classes
  const glow = (id: string) =>
    glowTarget === id
      ? 'shadow-[0_0_25px_rgba(46,230,214,0.6)] ring-2 ring-cyan/70 scale-[1.03]'
      : ''

  // Handle Scaling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const mobile = window.innerWidth < 768
        setIsMobile(mobile)

        const targetBaseWidth = mobile ? 600 : 1200
        setScale(width / targetBaseWidth)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    let mounted = true

    const runSequence = async () => {
      while (mounted) {
        // RESET STATE
        setStep(0)
        setCursorPos({ x: '60%', y: '60%' })
        setProjectName('')
        setProjectDesc('')
        setSelectedPlatform(null)
        setAiInput('')
        setCanvasNodes(false)
        setGlowTarget(null)

        // 1. Dashboard Idle -> Move to "New Project" button
        await wait(2000)
        moveCursor('91%', '5%')
        await wait(1500)

        // 2. Click "New Project" button
        await clickWithGlow('new-project')
        await wait(400)
        setStep(1) // Open Modal Step 1

        // 3. Move to Name Input & Type
        moveCursor('61%', '40%')
        await wait(800)
        await clickWithGlow('name-input')
        await typeText(NAME_TEXT, setProjectName)

        // 4. Move to Description Input & Type
        moveCursor('61%', '53%')
        await wait(800)
        await clickWithGlow('desc-input')
        await typeText(DESC_TEXT, setProjectDesc)

        // 5. Click "Next" button
        moveCursor('75%', '70%')
        await wait(1200)
        await clickWithGlow('next-btn')
        await wait(400)
        setStep(2) // Open Modal Step 2

        // 6. Select Mobile App card
        await wait(800)
        moveCursor('69%', '49%')
        await wait(1200)
        await clickWithGlow('mobile-card')
        setSelectedPlatform('mobile')

        // 7. Click "Create Project" button
        await wait(800)
        moveCursor('75%', '73%')
        await wait(1200)
        await clickWithGlow('create-btn')
        await wait(400)
        setStep(3) // Canvas Transition

        // 8. Canvas Loading
        await wait(3000)

        // 9. AI Typing
        moveCursor('88%', '93%')
        await wait(1200)
        await clickWithGlow('ai-input')
        await typeText(AI_PROMPT, setAiInput)

        // 10. Click Send
        moveCursor('96%', '93%')
        await wait(800)
        await clickWithGlow('send-btn')
        await wait(400)

        // 11. Generate Nodes
        setCanvasNodes(true)
        await wait(12000)

        // Loop
        await wait(3000)
      }
    }

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

    const moveCursor = (x: string, y: string) => {
      if (!mounted) return
      setCursorPos({ x, y })
    }

    const clickWithGlow = async (target: string) => {
      if (!mounted) return
      setGlowTarget(target)
      setIsClicking(true)
      await wait(150)
      if (!mounted) return
      setIsClicking(false)
      await wait(600)
      if (!mounted) return
      setGlowTarget(null)
    }

    const typeText = async (text: string, setter: (s: string) => void) => {
      for (let i = 0; i <= text.length; i++) {
        if (!mounted) return
        setter(text.slice(0, i))
        await wait(Math.random() * 50 + 50)
      }
    }

    runSequence()
    return () => { mounted = false }
  }, [])

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto aspect-[4/5] md:aspect-[16/10] bg-[#F6F8FB] rounded-md border border-slate-200 overflow-hidden relative shadow-2xl ring-1 ring-slate-900/5 font-sans select-none">
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`
        }}
      >

      {/* GLOBAL CURSOR */}
      <motion.div
        className="absolute z-[100] pointer-events-none"
        animate={{
          left: cursorPos.x,
          top: cursorPos.y,
          scale: isClicking ? 0.85 : 1
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          scale: { duration: 0.1 }
        }}
      >
        <MousePointer2 className="w-6 h-6 text-slate-900 fill-slate-900 stroke-[1.5px]" />
        {/* Click ripple effect */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-3 -left-3 w-8 h-8 rounded-full border-2 border-cyan bg-cyan/10"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* === LAYOUT: SIDEBAR (Persistent) === */}
      <div className="absolute inset-0 flex">
        <div className="hidden md:flex w-64 bg-[#0B1F33] flex-col z-20">
           {/* Logo */}
           <div className="h-16 flex items-center px-6 gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-md">
              <rect width="32" height="32" rx="7" fill="#0a1628"/>
              <g transform="translate(6, 5)">
                <path d="M3 0H11.25C14 0 16.25 2.25 16.25 5C16.25 6.7 15.4 8.2 14.1 9C16.5 10.1 18.12 12.5 18.12 15.25C18.12 18.9 15.15 22 11.56 22H3V0Z" fill="#00f0ff"/>
                <path d="M6.75 3.25H10.3C11.75 3.25 12.93 4.43 12.93 5.88C12.93 7.33 11.75 8.5 10.3 8.5H6.75V3.25Z" fill="#0a1628"/>
                <path d="M6.75 11.75H10.6C12.57 11.75 14.18 13.36 14.18 15.33C14.18 17.3 12.57 18.9 10.6 18.9H6.75V11.75Z" fill="#0a1628"/>
              </g>
            </svg>
            <span className="font-bold text-white tracking-tight text-lg">BlueprintAI</span>
          </div>

          {/* Menu */}
          <div className="p-4 space-y-2 mt-2">
            <div className="text-[10px] font-bold text-slate-500 mb-4 px-2 uppercase tracking-wider">Menu</div>
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 rounded-md">
              <Home size={18} /> Home
            </div>
            <div className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-md font-medium transition-colors ${step < 3 ? 'bg-cyan text-navy' : 'text-slate-400'}`}>
              <Folder size={18} /> Projects
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 rounded-md">
              <Users size={18} /> Team
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 rounded-md">
              <Settings size={18} /> Settings
            </div>

            {/* Recent Projects */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recent Projects</div>
                <Plus size={14} className="text-cyan" />
              </div>
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm text-cyan bg-white/5 rounded-md flex items-center gap-2 cursor-pointer">
                   <div className="w-4 h-4 rounded-sm border border-cyan/30 flex items-center justify-center bg-cyan/10">
                     <span className="text-[8px] font-bold">M</span>
                   </div>
                   Monra
                </div>
                <div className="px-3 py-2 text-sm text-slate-400 hover:text-white cursor-pointer hover:bg-white/5 rounded-md flex items-center gap-2">
                   <div className="w-4 h-4 rounded-sm border border-slate-700 flex items-center justify-center bg-slate-800">
                     <span className="text-[8px] font-bold">F</span>
                   </div>
                   Fintech App
                </div>
                <div className="px-3 py-2 text-sm text-slate-400 hover:text-white cursor-pointer hover:bg-white/5 rounded-md flex items-center gap-2">
                   <div className="w-4 h-4 rounded-sm border border-slate-700 flex items-center justify-center bg-slate-800">
                     <span className="text-[8px] font-bold">E</span>
                   </div>
                   E-commerce Platform
                </div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10 mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-cyan text-navy flex items-center justify-center font-bold text-xs">L</div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium text-white truncate">Lotanna</div>
              </div>
              <LogOut size={16} className="text-slate-500" />
            </div>
          </div>
        </div>

        {/* === MAIN CONTENT AREA === */}
        <div className="flex-1 relative bg-[#F6F8FB] overflow-hidden">

          {/* SCENE 1: DASHBOARD */}
          <motion.div
            className="absolute inset-0 flex flex-col"
            animate={{
              opacity: step < 3 ? 1 : 0,
              scale: step < 3 ? 1 : 1.1,
              filter: step < 3 ? 'blur(0px)' : 'blur(10px)'
            }}
            transition={{ duration: 0.8 }}
          >
            {/* Dashboard Header */}
            <div className="h-20 flex items-center justify-between px-8 border-b border-slate-200 bg-white">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                <p className="text-sm text-slate-500">Manage and organize your product blueprints</p>
              </div>
              <button className={`bg-[#0B1F33] text-white px-4 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 shadow-lg shadow-navy/20 transition-all duration-300 ${glow('new-project')}`}>
                <Plus size={16} /> New Project
              </button>
            </div>

            {/* Dashboard Empty State */}
            <div className="flex-1 p-8 flex items-center justify-center">
              <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-md flex flex-col items-center justify-center bg-white/50">
                <div className="w-16 h-16 bg-cyan/10 rounded-md flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-cyan" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Start Your First Blueprint</h2>
                <p className="text-slate-500 max-w-md text-center mb-8">
                  Create a new project to start visualizing your product requirements. Use our AI assistant to generate your initial structure in seconds.
                </p>
                <button className="bg-cyan text-navy px-6 py-3 rounded-md font-bold flex items-center gap-2 hover:bg-cyan/90 transition-colors">
                  Create Project <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* SCENE 2: MODAL OVERLAY */}
          <AnimatePresence>
            {(step === 1 || step === 2) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-30 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 10 }}
                  className="bg-white rounded-md shadow-2xl w-[500px] overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Create New Project</h3>
                    <X size={20} className="text-slate-400" />
                  </div>

                  {/* Modal Content - Step 1 */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Name <span className="text-red-500">*</span></label>
                        <div className={`h-10 px-3 rounded-md border flex items-center text-sm text-slate-900 transition-all duration-300 ${glowTarget === 'name-input' ? 'border-cyan shadow-[0_0_20px_rgba(46,230,214,0.4)] ring-2 ring-cyan/50' : 'border-cyan shadow-[0_0_0_1px_rgba(46,230,214,1)]'}`}>
                          {projectName}<span className="animate-pulse">|</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className={`h-24 p-3 rounded-md border text-sm text-slate-900 transition-all duration-300 ${glowTarget === 'desc-input' ? 'border-cyan shadow-[0_0_20px_rgba(46,230,214,0.4)] ring-2 ring-cyan/50 bg-white' : 'border-slate-200 bg-slate-50'}`}>
                          {projectDesc}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Modal Content - Step 2 */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6"
                    >
                      <h4 className="text-sm font-bold text-slate-900 mb-4">What are you building?</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Web App */}
                        <div className="p-3 border border-slate-200 rounded-md hover:border-cyan hover:bg-cyan/5 transition-colors cursor-pointer group">
                          <Globe className="w-5 h-5 text-slate-400 group-hover:text-cyan mb-2" />
                          <div className="font-bold text-sm text-slate-900">Web App</div>
                          <div className="text-[10px] text-slate-500">SaaS, Dashboard</div>
                        </div>

                        {/* Mobile App */}
                        <div className={`p-3 border rounded-md transition-all duration-300 cursor-pointer ${selectedPlatform === 'mobile' ? 'border-cyan bg-cyan/5 ring-1 ring-cyan' : 'border-slate-200'} ${glow('mobile-card')}`}>
                          <Smartphone className={`w-5 h-5 mb-2 ${selectedPlatform === 'mobile' ? 'text-cyan' : 'text-slate-400'}`} />
                          <div className="font-bold text-sm text-slate-900">Mobile App</div>
                          <div className="text-[10px] text-slate-500">iOS, Android</div>
                        </div>

                        {/* Platform */}
                        <div className="p-3 border border-slate-200 rounded-md hover:border-cyan hover:bg-cyan/5 transition-colors cursor-pointer group">
                          <Layout className="w-5 h-5 text-slate-400 group-hover:text-cyan mb-2" />
                          <div className="font-bold text-sm text-slate-900">Platform</div>
                          <div className="text-[10px] text-slate-500">Multi-sided, API</div>
                        </div>

                         {/* Other */}
                        <div className="p-3 border border-slate-200 rounded-md hover:border-cyan hover:bg-cyan/5 transition-colors cursor-pointer group">
                          <Box className="w-5 h-5 text-slate-400 group-hover:text-cyan mb-2" />
                          <div className="font-bold text-sm text-slate-900">Other</div>
                          <div className="text-[10px] text-slate-500">Custom, Hardware</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <button className="text-sm font-medium text-slate-500 hover:text-slate-900">Cancel</button>
                    <button className={`bg-[#0B1F33] text-white px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all duration-300 ${glow(step === 1 ? 'next-btn' : 'create-btn')}`}>
                      {step === 1 ? 'Next' : 'Create Project'} <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SCENE 3: CANVAS VIEW */}
          <motion.div
            className="absolute inset-0 flex flex-col bg-[#0B1F33]"
            initial={{ opacity: 0 }}
            animate={{
              opacity: step >= 3 ? 1 : 0,
              scale: step >= 3 ? 1 : 0.95
            }}
            transition={{ duration: 0.8 }}
          >
            {/* Canvas Header */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Projects</span>
                <span className="text-slate-300">/</span>
                <span className="font-bold text-slate-900">Monra</span>
                <span className="ml-2 px-2 py-0.5 bg-slate-100 text-[10px] font-bold uppercase rounded-md text-slate-500">Draft</span>
              </div>

              <div className="flex bg-slate-100 p-1 rounded-md">
                <div className="px-4 py-1.5 rounded-md text-xs font-bold bg-white text-slate-900 shadow-sm">Canvas</div>
                <div className="px-4 py-1.5 rounded-md text-xs font-medium text-slate-500">Strategy</div>
                <div className="px-4 py-1.5 rounded-md text-xs font-medium text-slate-500">Specs</div>
              </div>

              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-md text-[10px] font-bold border border-green-200">
                  <div className="w-1.5 h-1.5 rounded-md bg-green-500 animate-pulse" /> LIVE
                </div>
                <button className="bg-[#0B1F33] text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2">
                  <Share2 size={12} /> Share
                </button>
              </div>
            </div>

            {/* Canvas Body */}
            <div className="flex-1 flex min-h-0">
               {/* The Grid Canvas */}
               <div className="flex-1 relative overflow-hidden bg-[#0B1F33]">
                 {/* Dot Grid */}
                 <div
                   className="absolute inset-0 opacity-20"
                   style={{
                     backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                     backgroundSize: '24px 24px'
                   }}
                 />

                 {/* Nodes Container */}
                 <div className="absolute inset-0">
                   <AnimatePresence>
                     {canvasNodes && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 0.8 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="relative w-full h-full origin-left"
                      >
                          {/* Edges SVG Layer */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            {[
                              { endY: 150, delay: 0.2 },
                              { endY: 265, delay: 0.3 },
                              { endY: 380, delay: 0.4 },
                              { endY: 495, delay: 0.5 },
                              { endY: 610, delay: 0.6 },
                            ].map((edge, i) => (
                              <g key={`edge-group-${i}`}>
                                <motion.path
                                  d={`M 276 375 C 438 375, 438 ${edge.endY}, 600 ${edge.endY}`}
                                  fill="none"
                                  stroke="#2EE6D6"
                                  strokeWidth="2"
                                  strokeDasharray="8 6"
                                  initial={{ pathLength: 0, opacity: 0 }}
                                  animate={{
                                    pathLength: 1,
                                    opacity: 1,
                                    strokeDashoffset: [0, -28]
                                  }}
                                  transition={{
                                    pathLength: { duration: 1.2, delay: edge.delay, ease: "easeInOut" },
                                    opacity: { duration: 0.5, delay: edge.delay },
                                    strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" }
                                  }}
                                />
                                {/* Connection dot on curve midpoint */}
                                <motion.circle
                                  cx={438}
                                  cy={(375 + edge.endY) / 2}
                                  r="4"
                                  fill="#2EE6D6"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.7] }}
                                  transition={{ delay: edge.delay + 0.8, duration: 0.5 }}
                                />
                                {/* X Button on Curve */}
                                <motion.foreignObject
                                  width="20"
                                  height="20"
                                  x={428}
                                  y={(375 + edge.endY) / 2 - 10}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: edge.delay + 0.8, type: "spring" }}
                                >
                                  <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center shadow-md border border-slate-100 cursor-pointer hover:bg-slate-50">
                                    <X size={12} className="text-slate-400" />
                                  </div>
                                </motion.foreignObject>
                              </g>
                            ))}
                          </svg>

                          {/* Central Node */}
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className="absolute top-1/2 left-[20px] -translate-y-1/2 w-64 bg-white rounded-md shadow-xl border-2 border-cyan overflow-hidden z-10"
                          >
                            <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-2">
                              <div className="w-4 h-4 bg-amber-100 rounded-md text-amber-600 flex items-center justify-center"><User size={10} /></div>
                              <span className="text-xs font-bold text-slate-700">Lotenna Story</span>
                            </div>
                            <div className="p-3">
                              <div className="font-bold text-slate-900 text-sm mb-1">New userStory</div>
                              <div className="text-[10px] text-slate-400">Edit this description...</div>
                            </div>
                            {/* Selection Handles */}
                            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border border-cyan z-20" />
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-cyan z-20" />
                            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border border-cyan z-20" />
                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border border-cyan z-20" />
                            {/* Right connection handle */}
                            <motion.div
                              className="absolute top-1/2 -right-1.5 w-3 h-3 rounded-full bg-cyan border-2 border-white -translate-y-1/2 z-20"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </motion.div>

                          {/* Child Nodes */}
                          {[
                            { y: 150, delay: 0.6, label: 'Login Screen', tag: 'Auth' },
                            { y: 265, delay: 0.7, label: 'User Dashboard', tag: 'Screen' },
                            { y: 380, delay: 0.8, label: 'Search Walkers', tag: 'Discovery' },
                            { y: 495, delay: 0.9, label: 'Book a Walker', tag: 'Core Flow' },
                            { y: 610, delay: 1.0, label: 'Payment & Review', tag: 'Checkout' },
                          ].map((node, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, opacity: 0, x: 50 }}
                              animate={{ scale: 1, opacity: 1, x: 0 }}
                              transition={{ type: "spring", delay: node.delay }}
                              className="absolute left-[600px] w-64 bg-white rounded-md shadow-lg border border-slate-200 overflow-hidden z-10"
                              style={{ top: node.y, marginTop: -40 }}
                            >
                               <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-2">
                                 <div className="w-4 h-4 bg-amber-100 rounded-md text-amber-600 flex items-center justify-center"><User size={10} /></div>
                                 <span className="text-xs font-bold text-slate-700">{node.tag}</span>
                               </div>
                               <div className="p-3">
                                 <div className="font-bold text-slate-900 text-sm mb-1">{node.label}</div>
                                 <div className="text-[10px] text-slate-400">Edit this description...</div>
                               </div>
                               {/* Left connection handle */}
                               <motion.div
                                 className="absolute top-1/2 -left-1.5 w-3 h-3 rounded-full bg-cyan/60 border-2 border-white -translate-y-1/2"
                                 animate={{ scale: [1, 1.2, 1] }}
                                 transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                               />
                            </motion.div>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

             {/* Right AI Panel */}
             <div className="w-72 bg-white border-l border-slate-200 flex flex-col">
                <div className="h-12 border-b border-slate-100 flex items-center px-4 justify-between">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded">
                      <rect width="32" height="32" rx="7" fill="#0a1628"/>
                      <g transform="translate(6, 5)">
                        <path d="M3 0H11.25C14 0 16.25 2.25 16.25 5C16.25 6.7 15.4 8.2 14.1 9C16.5 10.1 18.12 12.5 18.12 15.25C18.12 18.9 15.15 22 11.56 22H3V0Z" fill="#00f0ff"/>
                        <path d="M6.75 3.25H10.3C11.75 3.25 12.93 4.43 12.93 5.88C12.93 7.33 11.75 8.5 10.3 8.5H6.75V3.25Z" fill="#0a1628"/>
                        <path d="M6.75 11.75H10.6C12.57 11.75 14.18 13.36 14.18 15.33C14.18 17.3 12.57 18.9 10.6 18.9H6.75V11.75Z" fill="#0a1628"/>
                      </g>
                    </svg>
                    <span className="font-bold text-slate-900 text-sm">BlueprintAI</span>
                  </div>
                  <PanelRight size={16} className="text-slate-400" />
                </div>

                <div className="flex-1 p-4 space-y-4">
                  {/* Bot Welcome */}
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-md bg-cyan/10 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={12} className="text-cyan" />
                    </div>
                    <div className="bg-slate-50 rounded-md rounded-tl-none p-3 text-xs text-slate-600">
                      Hi! I can help you draft your Mobile App PRD. Try asking me to &quot;Generate user stories for login&quot;.
                    </div>
                  </div>

                  {/* User Message */}
                  {aiInput && (
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center shrink-0 mt-1">
                        <User size={12} className="text-purple-600" />
                      </div>
                      <div className="bg-purple-50 rounded-md rounded-tr-none p-3 text-xs text-purple-900">
                        {aiInput}
                      </div>
                    </div>
                  )}

                  {/* Processing */}
                  {canvasNodes && (
                     <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div className="w-6 h-6 rounded-md bg-cyan/10 flex items-center justify-center shrink-0 mt-1">
                          <Sparkles size={12} className="text-cyan" />
                        </div>
                        <div className="bg-slate-50 rounded-md rounded-tl-none p-3 text-xs text-slate-600">
                          Generating user flow and screens for authentication module...
                        </div>
                      </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-100">
                  <div className={`bg-slate-50 rounded-md p-2 flex items-center gap-2 border transition-all duration-300 ${glowTarget === 'ai-input' ? 'border-cyan shadow-[0_0_20px_rgba(46,230,214,0.4)] ring-2 ring-cyan/50' : 'border-slate-200'}`}>
                    <input
                      readOnly
                      placeholder="Describe what you want to build..."
                      className="bg-transparent border-none text-xs text-slate-900 placeholder:text-slate-400 flex-1 focus:outline-none"
                    />
                    <button className={`p-1.5 rounded-md transition-all duration-300 ${aiInput ? 'bg-cyan text-navy' : 'bg-slate-200 text-slate-400'} ${glow('send-btn')}`}>
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      </div>
    </div>
  )
}
