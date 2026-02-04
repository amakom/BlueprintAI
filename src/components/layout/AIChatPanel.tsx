'use client';

import { Send, Sparkles, Lock, Settings2, MessageSquare, X, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import Link from 'next/link';
import { useCanvas } from '@/features/canvas/CanvasContext';
import { useState } from 'react';
import { PRODUCT_TYPES, TONES, ProductType, Tone } from '@/lib/ai-config';

type QuestionOption = {
  label: string;
  value: string;
};

type ClarifyingQuestion = {
  id: string;
  question: string;
  options: QuestionOption[];
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
  questions?: ClarifyingQuestion[];
  answeredQuestions?: Record<string, string>;
};

import { AlertModal } from '../ui/AlertModal';

export function AIChatPanel() {
  const { limits, isLoading } = useSubscription();
  const { setNodes, setEdges, projectId, aiSettings, setAiSettings } = useCanvas();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI planning partner. Describe what you want to build and I\'ll ask the right questions to help you plan it properly before you start coding.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pendingAnswers, setPendingAnswers] = useState<Record<string, string>>({});
  const [activeQuestionMsgIdx, setActiveQuestionMsgIdx] = useState<number | null>(null);

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
      // First, ask clarifying questions to help plan better
      const res = await fetch('/api/ai/ask-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          prompt: userMsg,
          productType: aiSettings.productType,
          tone: aiSettings.tone
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      if (data.questions && data.questions.length > 0) {
        const newMsgIdx = messages.length + 1;
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message || 'Let me ask a few questions to build a better plan for you.',
          questions: data.questions,
        }]);
        setActiveQuestionMsgIdx(newMsgIdx);
        setPendingAnswers({});
      } else {
        // No questions needed, generate directly
        await generateFlow(userMsg);
      }

    } catch (error) {
      console.error('AI Question Error:', error);
      setErrorAlert({
        isOpen: true,
        message: error instanceof Error ? error.message : 'Something went wrong.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (questionId: string, value: string) => {
    setPendingAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitAnswers = async () => {
    if (Object.keys(pendingAnswers).length === 0) return;

    const userMsgIdx = activeQuestionMsgIdx !== null ? activeQuestionMsgIdx - 1 : messages.length - 2;
    const originalPrompt = messages[userMsgIdx]?.content || '';

    const answerSummary = Object.entries(pendingAnswers)
      .map(([, value]) => value)
      .join(', ');

    setMessages(prev => [
      ...prev.map((msg, idx) =>
        idx === activeQuestionMsgIdx
          ? { ...msg, answeredQuestions: pendingAnswers }
          : msg
      ),
      { role: 'user' as const, content: answerSummary }
    ]);
    setActiveQuestionMsgIdx(null);
    const answersSnapshot = { ...pendingAnswers };
    setPendingAnswers({});
    setIsGenerating(true);

    try {
      await generateFlow(originalPrompt, answersSnapshot);
    } catch (error) {
      console.error('Generation error:', error);
      setErrorAlert({
        isOpen: true,
        message: error instanceof Error ? error.message : 'Something went wrong during generation.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFlow = async (prompt: string, context?: Record<string, string>) => {
    const res = await fetch('/api/ai/generate-user-flow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        prompt: context
          ? `${prompt}\n\nAdditional context from user:\n${Object.entries(context).map(([k, v]) => `${k}: ${v}`).join('\n')}`
          : prompt,
        productType: aiSettings.productType,
        tone: aiSettings.tone
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate flow');
    }

    if (data.warning) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Warning: ${data.warning}`
      }]);
    }

    if (data.nodes && data.nodes.length > 0) {
      setNodes((nds) => [...nds, ...data.nodes]);
      setEdges((eds) => [...eds, ...(data.edges || [])]);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I've generated ${data.nodes.length} node(s) on your canvas. You can drag and rearrange them to refine the flow.`
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I couldn\'t generate a flow for that request. Try being more specific about what you want to build.'
      }]);
    }
  };

  const handleSkipQuestions = async () => {
    const userMsgIdx = activeQuestionMsgIdx !== null ? activeQuestionMsgIdx - 1 : messages.length - 2;
    const originalPrompt = messages[userMsgIdx]?.content || '';

    setActiveQuestionMsgIdx(null);
    setPendingAnswers({});
    setIsGenerating(true);

    try {
      await generateFlow(originalPrompt);
    } catch (error) {
      console.error('Generation error:', error);
      setErrorAlert({
        isOpen: true,
        message: error instanceof Error ? error.message : 'Something went wrong during generation.'
      });
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
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1 rounded-md hover:bg-gray-200 transition-colors ${showSettings ? 'bg-gray-200 text-navy' : 'text-gray-500'}`}
            title="AI Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Plan it properly. Build it right.
        </p>

        {showSettings && (
          <div className="mt-3 p-3 bg-white rounded-md border border-border shadow-sm animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Product Type</label>
                <select
                  value={aiSettings.productType}
                  onChange={(e) => setAiSettings({ ...aiSettings, productType: e.target.value as ProductType })}
                  className="w-full text-xs p-1.5 border border-border rounded-md bg-cloud text-navy focus:outline-none focus:ring-1 focus:ring-cyan"
                >
                  {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Tone</label>
                <select
                  value={aiSettings.tone}
                  onChange={(e) => setAiSettings({ ...aiSettings, tone: e.target.value as Tone })}
                  className="w-full text-xs p-1.5 border border-border rounded-md bg-cloud text-navy focus:outline-none focus:ring-1 focus:ring-cyan"
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
          <div key={idx}>
            <div className={`p-3 rounded-md text-sm ${
              msg.role === 'assistant'
                ? 'bg-cloud rounded-tl-none text-navy'
                : 'bg-navy text-white rounded-tr-none ml-auto max-w-[90%]'
            }`}>
              {msg.content}
            </div>

            {/* Clarifying Questions UI */}
            {msg.role === 'assistant' && msg.questions && !msg.answeredQuestions && idx === activeQuestionMsgIdx && (
              <div className="mt-3 space-y-3">
                {msg.questions.map((q) => (
                  <div key={q.id} className="bg-white border border-border rounded-md p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <HelpCircle className="w-3.5 h-3.5 text-cyan mt-0.5 shrink-0" />
                      <span className="text-xs font-bold text-navy">{q.question}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {q.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelectAnswer(q.id, opt.value)}
                          className={`px-2.5 py-1.5 text-xs rounded-md border transition-all ${
                            pendingAnswers[q.id] === opt.value
                              ? 'border-cyan bg-cyan/10 text-cyan font-bold'
                              : 'border-border bg-cloud text-gray-600 hover:border-cyan/50 hover:text-navy'
                          }`}
                        >
                          {pendingAnswers[q.id] === opt.value && (
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                          )}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitAnswers}
                    disabled={Object.keys(pendingAnswers).length === 0}
                    className="flex-1 bg-navy text-white px-4 py-2 rounded-md text-xs font-bold disabled:opacity-40 hover:bg-navy/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3 h-3" />
                    Generate Blueprint
                  </button>
                  <button
                    onClick={handleSkipQuestions}
                    className="px-3 py-2 border border-border text-gray-500 rounded-md text-xs hover:bg-cloud transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* Answered Questions Summary */}
            {msg.role === 'assistant' && msg.questions && msg.answeredQuestions && (
              <div className="mt-2 p-2 bg-cyan/5 border border-cyan/20 rounded-md">
                <div className="text-[10px] text-cyan font-bold mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Questions Answered
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.values(msg.answeredQuestions).map((answer, i) => (
                    <span key={i} className="text-[10px] bg-cyan/10 text-cyan px-2 py-0.5 rounded-md">
                      {answer}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {isGenerating && (
          <div className="bg-cloud p-3 rounded-md rounded-tl-none text-sm text-navy flex items-center gap-2">
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
              disabled={isGenerating || activeQuestionMsgIdx !== null}
              rows={1}
              style={{ minHeight: '38px', maxHeight: '120px' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={isGenerating || !input.trim() || activeQuestionMsgIdx !== null}
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
        className="lg:hidden fixed bottom-4 right-4 z-40 p-3 bg-cyan text-navy rounded-md shadow-lg hover:bg-cyan/90 transition-all hover:scale-105"
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
              className="absolute top-2 right-2 z-10 p-1 bg-white/50 rounded-md text-gray-500 hover:text-navy"
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
