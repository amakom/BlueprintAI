'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Layout, 
  Plus, 
  Search, 
  Bell, 
  Settings, 
  Home, 
  Folder, 
  Users, 
  LogOut,
  ChevronRight,
  Smartphone,
  Globe,
  Box,
  Cpu,
  X,
  Sparkles,
  Send,
  MoreHorizontal,
  Share2,
  Play,
  Clock,
  Download,
  User,
  PanelRight,
  MousePointer2
} from 'lucide-react'

export function ProductDemoAnimation() {
  const [step, setStep] = useState(0)
  
  // Animation State
  const [cursorPos, setCursorPos] = useState({ x: '50%', y: '50%' })
  const [isClicking, setIsClicking] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [aiInput, setAiInput] = useState('')
  const [canvasNodes, setCanvasNodes] = useState<boolean>(false)

  // Constants
  const NAME_TEXT = "Monra"
  const DESC_TEXT = "P2P Crypto Exchange"
  const AI_PROMPT = "Generate user stories for login"

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

        // 1. Dashboard Idle -> Move to Create Project (0s - 3s)
        await wait(2000)
        moveCursor('85%', '15%') // Position of New Project Button
        await wait(1500)
        
        // 2. Click Button (3.5s)
        click()
        await wait(500)
        setStep(1) // Open Modal Step 1
        
        // 3. Move to Name Input & Type (4s - 8s)
        moveCursor('50%', '42%')
        await wait(1000)
        await typeText(NAME_TEXT, setProjectName)
        
        // 4. Move to Desc Input & Type (8s - 13s)
        moveCursor('50%', '55%')
        await wait(1000)
        await typeText(DESC_TEXT, setProjectDesc)
        
        // 5. Click Next (13s - 15s)
        moveCursor('70%', '75%') // Next Button
        await wait(1500)
        click()
        await wait(500)
        setStep(2) // Open Modal Step 2
        
        // 6. Select Mobile App (15s - 18s)
        await wait(1000)
        moveCursor('65%', '45%') // Mobile App Card (Right side)
        await wait(1500)
        click()
        setSelectedPlatform('mobile')
        
        // 7. Click Next/Create (18s - 21s)
        await wait(1000)
        moveCursor('70%', '75%') // Next Button
        await wait(1500)
        click()
        await wait(500)
        setStep(3) // Canvas Transition
        
        // 8. Canvas Loading -> AI Panel (21s - 25s)
        await wait(3000) // Zoom transition time
        
        // 9. AI Typing (25s - 30s)
        moveCursor('85%', '85%') // AI Input area
        await wait(1500)
        await typeText(AI_PROMPT, setAiInput)
        
        // 10. Click Generate (30s - 32s)
        moveCursor('92%', '85%') // Send Button
        await wait(1000)
        click()
        await wait(500)
        
        // 11. Generate Nodes (32s - 45s)
        setCanvasNodes(true)
        await wait(10000) // Let user view the result
        
        // Loop
        await wait(5000)
      }
    }

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
    
    const moveCursor = (x: string, y: string) => {
      if (!mounted) return
      setCursorPos({ x, y })
    }
    
    const click = async () => {
      if (!mounted) return
      setIsClicking(true)
      await wait(150)
      if (!mounted) return
      setIsClicking(false)
    }
    
    const typeText = async (text: string, setter: (s: string) => void) => {
      for (let i = 0; i <= text.length; i++) {
        if (!mounted) return
        setter(text.slice(0, i))
        await wait(Math.random() * 50 + 50) // Natural typing speed
      }
    }

    runSequence()
    return () => { mounted = false }
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto aspect-[16/10] bg-[#F6F8FB] rounded-xl border border-slate-200 overflow-hidden relative shadow-2xl ring-1 ring-slate-900/5 font-sans select-none">
      
      {/* GLOBAL CURSOR */}
      <motion.div
        className="absolute z-[100] pointer-events-none"
        animate={{ 
          left: cursorPos.x, 
          top: cursorPos.y,
          scale: isClicking ? 0.9 : 1
        }}
        transition={{ 
          type: "spring", 
          damping: 30, 
          stiffness: 200,
          scale: { duration: 0.1 } 
        }}
      >
        <MousePointer2 className="w-6 h-6 text-slate-900 fill-slate-900 stroke-[1.5px]" />
      </motion.div>

      {/* === LAYOUT: SIDEBAR (Persistent) === */}
      <div className="absolute inset-0 flex">
        <div className="w-64 bg-[#0B1F33] flex flex-col z-20">
           {/* Logo */}
           <div className="h-16 flex items-center px-6 gap-3">
            <div className="w-8 h-8 bg-cyan rounded-md flex items-center justify-center text-navy font-bold text-lg">B</div>
            <span className="font-bold text-white tracking-tight text-lg">BlueprintAI</span>
          </div>

          {/* Menu */}
          <div className="p-4 space-y-2 mt-2">
            <div className="text-[10px] font-bold text-slate-500 mb-4 px-2 uppercase tracking-wider">Menu</div>
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 rounded-lg">
              <Home size={18} /> Home
            </div>
            <div className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg font-medium transition-colors ${step < 3 ? 'bg-cyan text-navy' : 'text-slate-400'}`}>
              <Folder size={18} /> Projects
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 rounded-lg">
              <Users size={18} /> Team
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 rounded-lg">
              <Settings size={18} /> Settings
            </div>
          </div>

          {/* Recent Projects */}
          <div className="p-6 mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recent Projects</div>
              <Plus size={14} className="text-cyan" />
            </div>
            <div className="space-y-3">
              <div className="text-sm text-slate-400 hover:text-white cursor-pointer">Fintech App</div>
              <div className="text-sm text-slate-400 hover:text-white cursor-pointer">E-commerce Platform</div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan text-navy flex items-center justify-center font-bold text-xs">L</div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium text-white truncate">Lotanna</div>
                <div className="text-xs text-slate-500 truncate">Owner Access</div>
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
              <button className="bg-[#0B1F33] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-navy/20">
                <Plus size={16} /> New Project
              </button>
            </div>

            {/* Dashboard Empty State */}
            <div className="flex-1 p-8 flex items-center justify-center">
              <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-white/50">
                <div className="w-16 h-16 bg-cyan/10 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-cyan" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Start Your First Blueprint</h2>
                <p className="text-slate-500 max-w-md text-center mb-8">
                  Create a new project to start visualizing your product requirements. Use our AI assistant to generate your initial structure in seconds.
                </p>
                <button className="bg-cyan text-navy px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-cyan/90 transition-colors">
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
                  className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden"
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
                        <div className="h-10 px-3 rounded-lg border border-cyan shadow-[0_0_0_1px_rgba(46,230,214,1)] flex items-center text-sm text-slate-900">
                          {projectName}<span className="animate-pulse">|</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className="h-24 p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900">
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-slate-200 rounded-xl hover:border-cyan hover:bg-cyan/5 transition-colors cursor-pointer group">
                          <Globe className="w-6 h-6 text-slate-400 group-hover:text-cyan mb-3" />
                          <div className="font-bold text-sm text-slate-900">Web App</div>
                          <div className="text-[10px] text-slate-500 mt-1">SaaS, Dashboard, Landing Page</div>
                        </div>
                        <div className={`p-4 border rounded-xl transition-all cursor-pointer ${selectedPlatform === 'mobile' ? 'border-cyan bg-cyan/5 ring-1 ring-cyan' : 'border-slate-200'}`}>
                          <Smartphone className={`w-6 h-6 mb-3 ${selectedPlatform === 'mobile' ? 'text-cyan' : 'text-slate-400'}`} />
                          <div className="font-bold text-sm text-slate-900">Mobile App</div>
                          <div className="text-[10px] text-slate-500 mt-1">iOS, Android, React Native</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <button className="text-sm font-medium text-slate-500 hover:text-slate-900">Cancel</button>
                    <button className="bg-[#0B1F33] text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
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
                <span className="ml-2 px-2 py-0.5 bg-slate-100 text-[10px] font-bold uppercase rounded-full text-slate-500">Draft</span>
              </div>
              
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <div className="px-4 py-1.5 rounded-md text-xs font-bold bg-white text-slate-900 shadow-sm">Canvas</div>
                <div className="px-4 py-1.5 rounded-md text-xs font-medium text-slate-500">Strategy</div>
                <div className="px-4 py-1.5 rounded-md text-xs font-medium text-slate-500">Specs</div>
              </div>

              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE
                </div>
                <button className="bg-[#0B1F33] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence>
                    {canvasNodes && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative w-full h-full"
                      >
                         {/* Central Node */}
                         <motion.div
                           initial={{ scale: 0, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           transition={{ type: "spring", delay: 0.2 }}
                           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-white rounded-lg shadow-xl border-2 border-cyan overflow-hidden z-10"
                         >
                           <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-2">
                             <div className="w-4 h-4 bg-orange-100 rounded text-orange-600 flex items-center justify-center"><User size={10} /></div>
                             <span className="text-xs font-bold text-slate-700">User Story</span>
                           </div>
                           <div className="p-3">
                             <div className="font-bold text-slate-900 text-sm mb-1">As a User, I want to Login</div>
                             <div className="text-[10px] text-slate-400">So that I can access my account safely.</div>
                           </div>
                         </motion.div>

                         {/* Child Nodes */}
                         {[
                           { x: -200, y: -100, label: "Enter Credentials", delay: 0.4 },
                           { x: 200, y: -100, label: "Forgot Password", delay: 0.6 },
                           { x: 0, y: 150, label: "2FA Verification", delay: 0.8 },
                         ].map((node, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, opacity: 0, x: node.x * 0.5, y: node.y * 0.5 }}
                              animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                              transition={{ type: "spring", delay: node.delay }}
                              className="absolute top-1/2 left-1/2 w-48 bg-[#1e293b] rounded-lg shadow-lg border border-white/10 overflow-hidden z-0"
                              style={{ marginLeft: -96, marginTop: -30 }} // Center offset
                            >
                               <div className="h-7 bg-white/5 border-b border-white/5 flex items-center px-3 gap-2">
                                 <div className="w-3 h-3 bg-purple-500/20 rounded text-purple-400 flex items-center justify-center"><Box size={8} /></div>
                                 <span className="text-[10px] font-bold text-slate-300">Screen</span>
                               </div>
                               <div className="p-3">
                                 <div className="font-bold text-white text-xs">{node.label}</div>
                               </div>
                               
                               {/* Connection Line (Simplified SVG overlay would be better but CSS lines work for simple demo) */}
                               <div 
                                 className="absolute top-1/2 left-1/2 w-0.5 bg-cyan/30 origin-top"
                                 style={{ 
                                   height: 200, 
                                   transform: `rotate(${Math.atan2(-node.y, -node.x) * (180/Math.PI) + 90}deg) translate(0, -50%)`,
                                   zIndex: -1
                                 }} 
                               />
                            </motion.div>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right AI Panel */}
              <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
                <div className="h-12 border-b border-slate-100 flex items-center px-4 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-cyan rounded flex items-center justify-center text-navy font-bold text-[10px]">B</div>
                    <span className="font-bold text-slate-900 text-sm">BlueprintAI</span>
                  </div>
                  <PanelRight size={16} className="text-slate-400" />
                </div>
                
                <div className="flex-1 p-4 space-y-4">
                  {/* Bot Welcome */}
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-cyan/10 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={12} className="text-cyan" />
                    </div>
                    <div className="bg-slate-50 rounded-lg rounded-tl-none p-3 text-xs text-slate-600">
                      Hi! I can help you draft your Mobile App PRD. Try asking me to "Generate user stories for login".
                    </div>
                  </div>

                  {/* User Message */}
                  {aiInput && (
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center shrink-0 mt-1">
                        <User size={12} className="text-purple-600" />
                      </div>
                      <div className="bg-purple-50 rounded-lg rounded-tr-none p-3 text-xs text-purple-900">
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
                        <div className="w-6 h-6 rounded bg-cyan/10 flex items-center justify-center shrink-0 mt-1">
                          <Sparkles size={12} className="text-cyan" />
                        </div>
                        <div className="bg-slate-50 rounded-lg rounded-tl-none p-3 text-xs text-slate-600">
                          Generating user flow and screens for authentication module...
                        </div>
                      </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2 border border-slate-200">
                    <input 
                      readOnly
                      placeholder="Describe what you want to build..."
                      className="bg-transparent border-none text-xs text-slate-900 placeholder:text-slate-400 flex-1 focus:outline-none"
                    />
                    <button className={`p-1.5 rounded transition-colors ${aiInput ? 'bg-cyan text-navy' : 'bg-slate-200 text-slate-400'}`}>
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
  )
}
