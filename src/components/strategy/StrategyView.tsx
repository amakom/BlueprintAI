'use client';

import { useState } from 'react';

interface StrategyViewProps {
  projectId: string;
}

type Tab = 'okrs' | 'personas' | 'doc';

export function StrategyView({ projectId }: StrategyViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('okrs');

  return (
    <div className="flex flex-col h-full bg-cloud p-6 overflow-y-auto">
      <div className="flex items-center space-x-4 mb-6 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('okrs')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'okrs' 
              ? 'text-navy border-b-2 border-navy' 
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          OKRs
        </button>
        <button
          onClick={() => setActiveTab('personas')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'personas' 
              ? 'text-navy border-b-2 border-navy' 
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          Personas
        </button>
        <button
          onClick={() => setActiveTab('doc')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'doc' 
              ? 'text-navy border-b-2 border-navy' 
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          Strategy Doc
        </button>
      </div>

      <div className="flex-1">
        {activeTab === 'okrs' && <OKRSection projectId={projectId} />}
        {activeTab === 'personas' && <PersonaSection projectId={projectId} />}
        {activeTab === 'doc' && <StrategyDocSection projectId={projectId} />}
      </div>
    </div>
  );
}

function OKRSection({ projectId }: { projectId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [okrs, setOkrs] = useState<any[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/okr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, description: "Generate OKRs for this project" })
      });
      const data = await res.json();
      if (data.okrs) {
        setOkrs(data.okrs);
      }
    } catch (e) {
      console.error("Failed to generate OKRs:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy">Objectives & Key Results</h2>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
        >
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </button>
      </div>
      
      {okrs.length > 0 ? (
        <div className="grid gap-4">
          {okrs.map(okr => (
            <div key={okr.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-2">{okr.objective}</h3>
              <ul className="list-disc list-inside text-slate-600">
                {okr.keyResults.map((kr: string, i: number) => (
                  <li key={i}>{kr}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-center py-8">No OKRs defined yet. Start by generating some!</p>
        </div>
      )}
    </div>
  );
}

function PersonaSection({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy">User Personas</h2>
        <button className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
          Add Persona
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-center py-8">No personas created yet.</p>
      </div>
    </div>
  );
}

function StrategyDocSection({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy">Strategy Document</h2>
        <button className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
          Edit
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
        <p className="text-slate-500 p-4">Strategy content goes here...</p>
      </div>
    </div>
  );
}
