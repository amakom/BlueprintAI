'use client';

import { Send, Sparkles, Lock, Settings2, MessageSquare, X } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import Link from 'next/link';
import { useCanvas } from '@/features/canvas/CanvasContext';
import { useState } from 'react';
import { Node } from '@xyflow/react';
import { PRODUCT_TYPES, TONES, ProductType, Tone } from '@/lib/ai-config';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

import { AlertModal } from '../ui/AlertModal';

export function AIChatPanel() {
  const { limits, isLoading } = useSubscription();
  const { addNode, setNodes, setEdges, projectId, userName, aiSettings, setAiSettings } = useCanvas();
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I can help you draft your Mobile App PRD. Try asking me to "Generate user stories for login".' }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Alert State
  const [errorAlert, setErrorAlert] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    if (!limits.canGenerateAI) {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Upgrade to Pro or Team plan to use AI generation features.' 
        }]);
        return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsGenerating(true);

    try {
        const res = await fetch('/api/ai/generate-user-flow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                projectId, 
                prompt: userMsg,
                productType: aiSettings.productType, // Optional, if API supports it
                tone: aiSettings.tone // Optional
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Failed to generate flow');
        }

        if (data.warning) {
             setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `⚠️ ${data.warning}` 
            }]);
        }

        if (data.nodes && data.nodes.length > 0) {
            // Append new nodes and edges
            setNodes((nds) => [...nds, ...data.nodes]);
            setEdges((eds) => [...eds, ...(data.edges || [])]);

            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `I've generated ${data.nodes.length} node(s) for your request.` 
            }]);
        } else {
             setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `I couldn't generate a flow for that request. Please try again.` 
            }]);
        }

    } catch (error) {
        console.error('AI Generation Error:', error);
        // Show centered alert instead of just chat message
        setErrorAlert({ 
            isOpen: true, 
            message: error instanceof Error ? error.message : 'Something went wrong during AI generation.' 
        });
        
        // Also add to chat history for record
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}` 
        }]);
    } finally {
        setIsGenerating(false);
    }
  };

  const ChatContent = () => (
    <div className="flex flex-col h-full bg-white shadow-lg w-full">
      <AlertModal 
        isOpen={errorAlert.isOpen} 
        onClose={() => setErrorAlert({ ...errorAlert, isOpen: false })} 
        message={errorAlert.message} 
        title="AI Generation Failed"
      />
      <div className="p-4 border-b border-border bg-cloud/50">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-navy flex items-center gap-2">
            <div className="w-6 h-6 bg-cyan rounded-md flex items-center justify-center text-navy text-xs font-bold">
              B
            </div>
            BlueprintAI
          </h2>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1 rounded hover:bg-gray-200 transition-colors ${showSettings ? 'bg-gray-200 text-navy' : 'text-gray-500'}`}
            title="AI Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
            Generate PRDs, user flows, and tickets.
        </p>
        
        {showSettings && (
          <div className="mt-3 p-3 bg-white rounded-md border border-border shadow-sm animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Product Type</label>
                <select 
                  value={aiSettings.productType}
                  onChange={(e) => setAiSettings({...aiSettings, productType: e.target.value as ProductType})}
                  className="w-full text-xs p-1.5 border border-border rounded bg-cloud text-navy focus:outline-none focus:ring-1 focus:ring-cyan"
                >
                  {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Tone</label>
                <select 
                  value={aiSettings.tone}
                  onChange={(e) => setAiSettings({...aiSettings, tone: e.target.value as Tone})}
                  className="w-full text-xs p-1.5 border border-border rounded bg-cloud text-navy focus:outline-none focus:ring-1 focus:ring-cyan"
                >
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
            <div key={idx} className={`p-3 rounded-lg text-sm ${
                msg.role === 'assistant' 
                ? 'bg-cloud rounded-tl-none text-navy' 
                : 'bg-navy text-white rounded-tr-none ml-auto max-w-[90%]'
            }`}>
                {msg.content}
            </div>
        ))}
        {isGenerating && (
             <div className="bg-cloud p-3 rounded-lg rounded-tl-none text-sm text-navy flex items-center gap-2">
                <Sparkles className="w-3 h-3 animate-spin text-cyan" />
                Thinking...
            </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-white">
        {!limits.canGenerateAI && !isLoading ? (
            <div className="text-center p-2 bg-cloud rounded-md">
                <p className="text-sm text-gray-500 mb-2">Upgrade to Pro to use AI</p>
                <Link href="/pricing" className="text-xs text-cyan font-bold hover:underline flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Unlock AI Features
                </Link>
            </div>
        ) : (
            <div className="flex gap-2">
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Describe what you want to build..."
                    className="flex-1 bg-cloud border-none rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-cyan outline-none resize-none"
                    disabled={isGenerating}
                    rows={1}
                    style={{ minHeight: '38px', maxHeight: '120px' }}
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={isGenerating || !input.trim()}
                    className="bg-navy text-white p-2 rounded-md hover:bg-navy/90 disabled:opacity-50 transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 p-3 bg-cyan text-navy rounded-full shadow-lg hover:bg-cyan/90 transition-all hover:scale-105"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Desktop Panel */}
      <div className="hidden lg:flex w-80 bg-white border-l border-border flex-col h-full shadow-lg">
        <ChatContent />
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
             onClick={() => setIsMobileOpen(false)}
           />
           {/* Drawer Panel */}
           <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col">
             <button 
               onClick={() => setIsMobileOpen(false)}
               className="absolute top-2 right-2 z-10 p-1 bg-white/50 rounded-full text-gray-500 hover:text-navy"
             >
               <X className="w-5 h-5" />
             </button>
             <ChatContent />
           </div>
        </div>
      )}
    </>
  );
}
