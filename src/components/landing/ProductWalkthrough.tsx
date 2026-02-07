'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  MessageSquare,
  LayoutDashboard,
  FileCode2,
  Sparkles,
  User,
  ArrowRight,
  Database,
  Globe,
  Smartphone,
  Shield,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react'

const STEPS = [
  {
    id: 'describe',
    label: 'Describe Your Idea',
    icon: MessageSquare,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    id: 'canvas',
    label: 'Visual Canvas',
    icon: LayoutDashboard,
    color: 'text-cyan',
    bgColor: 'bg-cyan/10',
    borderColor: 'border-cyan/30',
  },
  {
    id: 'specs',
    label: 'Engineering Specs',
    icon: FileCode2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
]

const STEP_DURATION = 6000

export function ProductWalkthrough() {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: '-100px' })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advanceStep = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % 3)
    setProgress(0)
  }, [])

  useEffect(() => {
    if (!isInView || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
      return
    }

    intervalRef.current = setInterval(advanceStep, STEP_DURATION)
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 100 / (STEP_DURATION / 50), 100))
    }, 50)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [isInView, isPaused, advanceStep])

  const handleStepClick = (index: number) => {
    setActiveStep(index)
    setProgress(0)
    // Reset timers
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    if (!isPaused) {
      intervalRef.current = setInterval(advanceStep, STEP_DURATION)
      progressRef.current = setInterval(() => {
        setProgress((p) => Math.min(p + 100 / (STEP_DURATION / 50), 100))
      }, 50)
    }
  }

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto">
      {/* Step Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 mb-8">
        {STEPS.map((step, i) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(i)}
            className={`flex-1 relative flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-lg sm:rounded-none sm:first:rounded-l-lg sm:last:rounded-r-lg transition-all duration-300 text-left ${
              activeStep === i
                ? 'bg-white/10 border border-white/20'
                : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06]'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeStep === i ? step.bgColor : 'bg-white/5'}`}>
              <step.icon className={`w-4 h-4 ${activeStep === i ? step.color : 'text-gray-500'}`} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Step {i + 1}</div>
              <div className={`text-sm font-bold ${activeStep === i ? 'text-white' : 'text-gray-400'}`}>{step.label}</div>
            </div>
            {/* Progress bar */}
            {activeStep === i && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan to-cyan/50 rounded-full"
                style={{ width: `${progress}%` }}
              />
            )}
            {/* Arrow between steps */}
            {i < 2 && (
              <div className="hidden sm:block absolute -right-3 z-10">
                <ChevronRight className={`w-5 h-5 ${activeStep > i ? 'text-cyan' : 'text-gray-600'}`} />
              </div>
            )}
          </button>
        ))}

        {/* Play/Pause */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="hidden sm:flex ml-3 w-10 h-10 rounded-lg bg-white/5 border border-white/10 items-center justify-center hover:bg-white/10 transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4 text-gray-400" /> : <Pause className="w-4 h-4 text-gray-400" />}
        </button>
      </div>

      {/* Demo Content */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0a1628] shadow-2xl shadow-cyan/5 min-h-[420px]">
        {/* Browser Chrome */}
        <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white/5 rounded-md px-4 py-1 text-xs text-gray-500 font-mono">
              app.blueprintai.dev
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {activeStep === 0 && <DescribeStep key="describe" />}
            {activeStep === 1 && <CanvasStep key="canvas" />}
            {activeStep === 2 && <SpecsStep key="specs" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ==================== STEP 1: DESCRIBE YOUR IDEA ==================== */
function DescribeStep() {
  const [typedText, setTypedText] = useState('')
  const [showResults, setShowResults] = useState(false)
  const fullText = 'A marketplace where pet owners can find and book verified dog walkers in their area'

  useEffect(() => {
    let i = 0
    const typeInterval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => setShowResults(true), 400)
      }
    }, 30)
    return () => clearInterval(typeInterval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* AI Chat Input */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-cyan" />
          </div>
          <div className="bg-white/5 rounded-lg rounded-tl-none p-4 text-sm text-gray-300 border border-white/5">
            Tell me about the app you want to build. I&apos;ll help you define the strategy, users, and goals.
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-purple-400" />
          </div>
          <div className="bg-purple-500/5 rounded-lg rounded-tl-none p-4 text-sm text-purple-200 border border-purple-500/10 flex-1">
            {typedText}
            <span className="animate-pulse text-cyan">|</span>
          </div>
        </div>
      </div>

      {/* AI Generated Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-cyan" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="text-sm text-gray-300">Here&apos;s your strategic foundation:</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Target Users', items: ['Pet Owners', 'Dog Walkers', 'Admins'], delay: 0 },
                    { label: 'Key Goals', items: ['50% D7 Retention', '3.5% Conversion', 'NPS > 60'], delay: 0.1 },
                    { label: 'Competitors', items: ['Rover', 'Wag!', 'PetBacker'], delay: 0.2 },
                  ].map((card, ci) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: card.delay + 0.2, duration: 0.3 }}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="text-xs font-bold text-cyan mb-2">{card.label}</div>
                      {card.items.map((item, ii) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: card.delay + 0.3 + ii * 0.1 }}
                          className="text-xs text-gray-400 flex items-center gap-1.5 py-0.5"
                        >
                          <span className="w-1 h-1 rounded-full bg-cyan/60" />
                          {item}
                        </motion.div>
                      ))}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ==================== STEP 2: VISUAL CANVAS ==================== */
function CanvasStep() {
  const nodes = [
    { id: 'signup', label: 'Sign Up', x: 60, y: 30, tag: 'Auth' },
    { id: 'login', label: 'Login', x: 60, y: 130, tag: 'Auth' },
    { id: 'dashboard', label: 'Dashboard', x: 280, y: 80, tag: 'Screen' },
    { id: 'search', label: 'Search Walkers', x: 500, y: 30, tag: 'Discovery' },
    { id: 'profile', label: 'Walker Profile', x: 500, y: 130, tag: 'Screen' },
    { id: 'book', label: 'Book & Pay', x: 500, y: 230, tag: 'Core' },
  ]

  const edges = [
    { from: 'signup', to: 'dashboard' },
    { from: 'login', to: 'dashboard' },
    { from: 'dashboard', to: 'search' },
    { from: 'search', to: 'profile' },
    { from: 'profile', to: 'book' },
  ]

  const nodePositions: Record<string, { x: number; y: number }> = {}
  nodes.forEach(n => { nodePositions[n.id] = { x: n.x, y: n.y } })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Canvas Header Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Projects /</span>
          <span className="font-bold text-white">PetWalk App</span>
          <span className="px-2 py-0.5 bg-cyan/10 text-cyan text-[10px] font-bold rounded-md">CANVAS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-[10px] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative h-[280px] rounded-lg bg-[#0B1F33] border border-white/5 overflow-hidden">
        {/* Dot Grid */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Edges SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge, i) => {
            const from = nodePositions[edge.from]
            const to = nodePositions[edge.to]
            if (!from || !to) return null
            const x1 = from.x + 140
            const y1 = from.y + 25
            const x2 = to.x
            const y2 = to.y + 25
            const mx = (x1 + x2) / 2
            return (
              <motion.path
                key={`${edge.from}-${edge.to}`}
                d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="#2EE6D6"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6, strokeDashoffset: [0, -20] }}
                transition={{
                  pathLength: { duration: 0.8, delay: 0.5 + i * 0.15, ease: 'easeInOut' },
                  opacity: { duration: 0.4, delay: 0.5 + i * 0.15 },
                  strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'linear' },
                }}
              />
            )
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2 + i * 0.12, damping: 20 }}
            className="absolute w-[140px] bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden"
            style={{ left: node.x, top: node.y }}
          >
            <div className="h-6 bg-slate-50 border-b border-slate-100 flex items-center px-2 gap-1.5">
              <div className="w-3 h-3 bg-amber-100 rounded text-amber-600 flex items-center justify-center">
                <User className="w-2 h-2" />
              </div>
              <span className="text-[9px] font-bold text-slate-500">{node.tag}</span>
            </div>
            <div className="px-2 py-1.5">
              <div className="font-bold text-slate-900 text-[11px]">{node.label}</div>
            </div>
            {/* Connection handle */}
            <motion.div
              className="absolute top-1/2 -right-1 w-2 h-2 rounded-full bg-cyan border border-white -translate-y-1/2"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ==================== STEP 3: ENGINEERING SPECS ==================== */
function SpecsStep() {
  const [visibleLines, setVisibleLines] = useState(0)

  const specSections = [
    {
      title: 'Database Schema',
      icon: Database,
      lines: [
        { text: 'model User {', indent: 0 },
        { text: 'id       String   @id @default(uuid())', indent: 1 },
        { text: 'email    String   @unique', indent: 1 },
        { text: 'name     String', indent: 1 },
        { text: 'role     Role     @default(OWNER)', indent: 1 },
        { text: '}', indent: 0 },
      ],
    },
    {
      title: 'API Routes',
      icon: Globe,
      lines: [
        { text: 'POST   /api/auth/register', indent: 0 },
        { text: 'POST   /api/auth/login', indent: 0 },
        { text: 'GET    /api/walkers', indent: 0 },
        { text: 'POST   /api/bookings', indent: 0 },
        { text: 'GET    /api/bookings/:id', indent: 0 },
      ],
    },
    {
      title: 'Screen Components',
      icon: Smartphone,
      lines: [
        { text: '<SignUpPage />       /signup', indent: 0 },
        { text: '<Dashboard />        /dashboard', indent: 0 },
        { text: '<SearchWalkers />    /search', indent: 0 },
        { text: '<WalkerProfile />    /walker/:id', indent: 0 },
        { text: '<BookingFlow />      /book/:walkerId', indent: 0 },
      ],
    },
  ]

  const totalLines = specSections.reduce((acc, s) => acc + s.lines.length, 0)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= totalLines) {
        setVisibleLines(i)
        i++
      } else {
        clearInterval(interval)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [totalLines])

  let lineCounter = 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {specSections.map((section) => (
          <div key={section.title} className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
              <section.icon className="w-3.5 h-3.5 text-cyan" />
              <span className="text-xs font-bold text-white">{section.title}</span>
            </div>
            <div className="p-3 font-mono text-[11px] space-y-0.5">
              {section.lines.map((line, li) => {
                const thisLine = lineCounter
                lineCounter++
                return (
                  <motion.div
                    key={li}
                    initial={{ opacity: 0, x: -5 }}
                    animate={
                      visibleLines > thisLine
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -5 }
                    }
                    transition={{ duration: 0.2 }}
                    className="text-gray-400"
                    style={{ paddingLeft: line.indent * 16 }}
                  >
                    <span className="text-gray-600 mr-2">{thisLine + 1}</span>
                    {line.text}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Ready Badge */}
      {visibleLines >= totalLines && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex items-center justify-center gap-2 text-sm"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-bold">Spec complete — ready to hand off to your AI agent or dev team</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
