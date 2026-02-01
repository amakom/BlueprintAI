'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Save, Download, FileText, Loader2 } from 'lucide-react';

interface SpecViewProps {
  projectId: string;
}

export function SpecView({ projectId }: SpecViewProps) {
  const [spec, setSpec] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Fetch existing spec
  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/spec`);
        if (res.ok) {
          const data = await res.json();
          if (data.spec?.content) {
            // content is stored as Json, we expect { markdown: string } or just the string if legacy
            const content = data.spec.content;
            setSpec(typeof content === 'string' ? content : content.markdown || '');
            setLastSaved(new Date(data.spec.updatedAt));
          }
        }
      } catch (error) {
        console.error('Failed to fetch spec:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpec();
  }, [projectId]);

  const handleGenerate = async () => {
    if (!confirm('This will overwrite the current spec based on the latest Canvas data. Continue?')) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate spec');
      
      setSpec(data.spec);
      // Auto-save after generation
      await saveSpec(data.spec);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate spec. Make sure your canvas has content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveSpec = async (content: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/spec`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: { markdown: content } })
      });
      
      if (res.ok) {
        const data = await res.json();
        setLastSaved(new Date(data.spec.updatedAt));
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([spec], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'engineering-spec.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy/50" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-cloud">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber/10 rounded-lg">
            <FileText className="h-5 w-5 text-amber" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-navy">Engineering Spec</h2>
            <p className="text-xs text-slate-500">
              {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Unsaved'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-navy bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber" />}
            AI Generate
          </button>
          
          <button
            onClick={() => saveSpec(spec)}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-navy rounded-md hover:bg-navy/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>

          <button
            onClick={handleDownload}
            disabled={!spec}
            className="p-2 text-slate-500 hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
            title="Download Markdown"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <textarea
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              className="flex-1 w-full p-8 resize-none focus:outline-none font-mono text-sm leading-relaxed text-slate-800"
              placeholder="Click 'AI Generate' to create an engineering spec from your canvas flow..."
            />
        </div>
      </div>
    </div>
  );
}
