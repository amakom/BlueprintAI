'use client';

import { Send, Sparkles, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import Link from 'next/link';
import { useCanvas } from '@/features/canvas/CanvasContext';
import { useState } from 'react';
import { Node } from '@xyflow/react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AIChatPanel() {
  const { limits, isLoading } = useSubscription();
  const { addNode } = useCanvas();
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I can help you draft your Mobile App PRD. Try asking me to "Generate user stories for login".' }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

    // Simulate AI delay
    setTimeout(() => {
        const newNodes: Node[] = [];
        const timestamp = Date.now();
        
        // Simple mock logic for MVP
        if (userMsg.toLowerCase().includes('login')) {
            newNodes.push({
                id: `node-${timestamp}-1`,
                type: 'userStory',
                position: { x: Math.random() * 400, y: Math.random() * 400 },
                data: { label: 'Login Screen', description: 'User enters email and password.', userName }
            });
            newNodes.push({
                id: `node-${timestamp}-2`,
                type: 'userStory',
                position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
                data: { label: 'Forgot Password', description: 'Flow to reset password via email.', userName }
            });
        } else if (userMsg.toLowerCase().includes('dashboard')) {
             newNodes.push({
                id: `node-${timestamp}-1`,
                type: 'userStory',
                position: { x: Math.random() * 400, y: Math.random() * 400 },
                data: { label: 'Dashboard Overview', description: 'Main view showing key metrics.', userName }
            });
        } else {
             newNodes.push({
                id: `node-${timestamp}-1`,
                type: 'userStory',
                position: { x: Math.random() * 400, y: Math.random() * 400 },
                data: { label: 'New Feature', description: `Generated for: "${userMsg}"`, userName }
            });
        }

        newNodes.forEach(node => addNode(node));

        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `I've generated ${newNodes.length} node(s) for your request.` 
        }]);
        setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="w-80 bg-white border-l border-border flex flex-col h-full shadow-lg">
      <div className="p-4 border-b border-border bg-cloud/50">
        <h2 className="font-bold text-navy flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan" />
            Blueprint AI
        </h2>
        <p className="text-xs text-gray-500 mt-1">
            Generate PRDs, user flows, and tickets.
        </p>
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
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe what you want to build..."
                    className="flex-1 bg-cloud border-none rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-cyan outline-none"
                    disabled={isGenerating}
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
}
