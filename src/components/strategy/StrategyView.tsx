'use client';

import { useState, useEffect } from 'react';

interface StrategyViewProps {
  projectId: string;
}

type Tab = 'okrs' | 'kpis' | 'personas' | 'competitors' | 'doc';

export function StrategyView({ projectId }: StrategyViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('okrs');

  return (
    <div className="flex flex-col h-full bg-cloud p-6 overflow-y-auto">
      <div className="flex items-center space-x-4 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('okrs')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'okrs' 
              ? 'text-navy border-b-2 border-navy' 
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          OKRs
        </button>
        <button
          onClick={() => setActiveTab('kpis')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'kpis' 
              ? 'text-navy border-b-2 border-navy' 
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          KPIs
        </button>
        <button
          onClick={() => setActiveTab('personas')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'personas' 
              ? 'text-navy border-b-2 border-navy' 
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          Personas
        </button>
        <button
          onClick={() => setActiveTab('competitors')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'competitors' 
              ? 'text-navy border-b-2 border-navy' 
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          Competitors
        </button>
        <button
          onClick={() => setActiveTab('doc')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
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
        {activeTab === 'kpis' && <KPISection projectId={projectId} />}
        {activeTab === 'personas' && <PersonaSection projectId={projectId} />}
        {activeTab === 'competitors' && <CompetitorSection projectId={projectId} />}
        {activeTab === 'doc' && <StrategyDocSection projectId={projectId} />}
      </div>
    </div>
  );
}

function OKRSection({ projectId }: { projectId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [okrs, setOkrs] = useState<any[]>([]);

  // Fetch OKRs on mount
  useEffect(() => {
    const fetchOKRs = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/okrs`);
        if (res.ok) {
          const data = await res.json();
          setOkrs(data.okrs);
        }
      } catch (e) {
        console.error("Failed to fetch OKRs:", e);
      }
    };
    fetchOKRs();
  }, [projectId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Don't send hardcoded description so backend uses project description
      const res = await fetch('/api/ai/generate-okrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }) 
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate OKRs');
      }
      
      if (data.okrs) {
        // Append generated OKRs (they won't have IDs yet)
        setOkrs(prev => [...prev, ...data.okrs]);
      }
    } catch (e) {
      console.error("Failed to generate OKRs:", e);
      alert(e instanceof Error ? e.message : "Failed to generate OKRs");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const unsavedOkrs = okrs.filter(o => !o.id);
    if (unsavedOkrs.length === 0) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/okrs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ okrs: unsavedOkrs })
      });
      
      if (res.ok) {
        const data = await res.json();
        // Replace unsaved OKRs with saved ones (which have IDs)
        setOkrs(prev => [...prev.filter(o => o.id), ...data.okrs]);
      }
    } catch (e) {
      console.error("Failed to save OKRs:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsaved = okrs.some(o => !o.id);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy">Objectives & Key Results</h2>
        <div className="flex gap-2">
          {hasUnsaved && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </div>
      
      {okrs.length > 0 ? (
        <div className="grid gap-4">
          {okrs.map((okr, index) => (
            <div key={okr.id || `temp-${index}`} className={`bg-white p-6 rounded-xl shadow-sm border ${!okr.id ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-100'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{okr.objective}</h3>
                {!okr.id && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Unsaved</span>}
              </div>
              <ul className="list-disc list-inside text-slate-600">
                {(Array.isArray(okr.keyResults) ? okr.keyResults : []).map((kr: string, i: number) => (
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

function KPISection({ projectId }: { projectId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [kpis, setKpis] = useState<any[]>([]);

  // Fetch KPIs on mount
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/kpis`);
        if (res.ok) {
          const data = await res.json();
          setKpis(data.kpis);
        }
      } catch (e) {
        console.error("Failed to fetch KPIs:", e);
      }
    };
    fetchKPIs();
  }, [projectId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-kpis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }) 
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate KPIs');
      }
      
      if (data.kpis) {
        setKpis(prev => [...prev, ...data.kpis]);
      }
    } catch (e) {
      console.error("Failed to generate KPIs:", e);
      alert(e instanceof Error ? e.message : "Failed to generate KPIs");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const unsavedKpis = kpis.filter(k => !k.id);
    if (unsavedKpis.length === 0) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/kpis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kpis: unsavedKpis })
      });
      
      if (res.ok) {
        const data = await res.json();
        setKpis(prev => [...prev.filter(k => k.id), ...data.kpis]);
      }
    } catch (e) {
      console.error("Failed to save KPIs:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsaved = kpis.some(k => !k.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK': return 'bg-green-100 text-green-800';
      case 'AT_RISK': return 'bg-yellow-100 text-yellow-800';
      case 'OFF_TRACK': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy">Key Performance Indicators</h2>
        <div className="flex gap-2">
          {hasUnsaved && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </div>
      
      {kpis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => (
            <div key={kpi.id || `temp-${index}`} className={`bg-white p-6 rounded-xl shadow-sm border ${!kpi.id ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(kpi.status)}`}>
                  {kpi.status.replace('_', ' ')}
                </span>
                {!kpi.id && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Unsaved</span>}
              </div>
              <h3 className="font-bold text-lg text-navy mb-2">{kpi.name}</h3>
              <div className="text-3xl font-bold text-slate-800">{kpi.target}</div>
              <p className="text-sm text-slate-500 mt-2">Target Goal</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-center py-8">No KPIs defined yet. Start by generating some!</p>
        </div>
      )}
    </div>
  );
}

function PersonaSection({ projectId }: { projectId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [personas, setPersonas] = useState<any[]>([]);

  // Fetch Personas on mount
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/personas`);
        if (res.ok) {
          const data = await res.json();
          setPersonas(data.personas);
        }
      } catch (e) {
        console.error("Failed to fetch Personas:", e);
      }
    };
    fetchPersonas();
  }, [projectId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }) 
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate Personas');
      }

      if (data.personas) {
        setPersonas(prev => [...prev, ...data.personas]);
      }
    } catch (e) {
      console.error("Failed to generate Personas:", e);
      alert(e instanceof Error ? e.message : "Failed to generate Personas");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const unsavedPersonas = personas.filter(p => !p.id);
    if (unsavedPersonas.length === 0) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personas: unsavedPersonas })
      });
      
      if (res.ok) {
        const data = await res.json();
        setPersonas(prev => [...prev.filter(p => p.id), ...data.personas]);
      }
    } catch (e) {
      console.error("Failed to save Personas:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsaved = personas.some(p => !p.id);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy">User Personas</h2>
        <div className="flex gap-2">
          {hasUnsaved && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </div>

      {personas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personas.map((persona, index) => (
            <div key={persona.id || `temp-${index}`} className={`bg-white p-6 rounded-xl shadow-sm border ${!persona.id ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-100'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {persona.imageUrl && (
                    <img src={persona.imageUrl} alt={persona.name} className="w-16 h-16 rounded-full bg-slate-100" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-navy">{persona.name}</h3>
                    <p className="text-slate-500 text-sm">{persona.role}</p>
                  </div>
                </div>
                {!persona.id && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Unsaved</span>}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1">Bio</h4>
                  <p className="text-slate-600 text-sm">{persona.bio}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1">Goals</h4>
                  <ul className="list-disc list-inside text-slate-600 text-sm">
                    {persona.goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1">Frustrations</h4>
                  <ul className="list-disc list-inside text-slate-600 text-sm">
                    {persona.frustrations.map((f: string, i: number) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-center py-8">No personas created yet. Generate some with AI!</p>
        </div>
      )}
    </div>
  );
}

function CompetitorSection({ projectId }: { projectId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);

  // Fetch Competitors on mount
  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/competitors`);
        if (res.ok) {
          const data = await res.json();
          setCompetitors(data.competitors);
        }
      } catch (e) {
        console.error("Failed to fetch Competitors:", e);
      }
    };
    fetchCompetitors();
  }, [projectId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }) 
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate Competitors');
      }

      if (data.competitors) {
        setCompetitors(prev => [...prev, ...data.competitors]);
      }
    } catch (e) {
      console.error("Failed to generate Competitors:", e);
      alert(e instanceof Error ? e.message : "Failed to generate Competitors");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const unsavedCompetitors = competitors.filter(c => !c.id);
    if (unsavedCompetitors.length === 0) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/competitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitors: unsavedCompetitors })
      });
      
      if (res.ok) {
        const data = await res.json();
        setCompetitors(prev => [...prev.filter(c => c.id), ...data.competitors]);
      }
    } catch (e) {
      console.error("Failed to save Competitors:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsaved = competitors.some(c => !c.id);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy">Competitor Analysis</h2>
        <div className="flex gap-2">
          {hasUnsaved && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </div>

      {competitors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitors.map((competitor, index) => (
            <div key={competitor.id || `temp-${index}`} className={`bg-white p-6 rounded-xl shadow-sm border ${!competitor.id ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-100'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-navy">{competitor.name}</h3>
                  {competitor.website && (
                    <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                      {competitor.website}
                    </a>
                  )}
                </div>
                {!competitor.id && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Unsaved</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold text-sm text-green-700 mb-1">Strengths</h4>
                  <ul className="list-disc list-inside text-slate-600 text-sm">
                    {competitor.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-red-700 mb-1">Weaknesses</h4>
                  <ul className="list-disc list-inside text-slate-600 text-sm">
                    {competitor.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-center py-8">No competitors analyzed yet. Generate some with AI!</p>
        </div>
      )}
    </div>
  );
}

function StrategyDocSection({ projectId }: { projectId: string }) {
  const [doc, setDoc] = useState<any>(null);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/strategy-doc`);
        if (res.ok) {
          const data = await res.json();
          if (data.doc) {
            setDoc(data.doc);
            // Assume content is { text: "..." }
            setContent(data.doc.content?.text || '');
          }
        }
      } catch (e) {
        console.error("Failed to fetch Strategy Doc:", e);
      }
    };
    fetchDoc();
  }, [projectId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/strategy-doc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: { text: content },
          title: 'Product Strategy'
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setDoc(data.doc);
        setIsEditing(false);
      }
    } catch (e) {
      console.error("Failed to save Strategy Doc:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy">Strategy Document</h2>
        {isEditing ? (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="text-slate-500 hover:text-slate-700 px-4 py-2"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[400px] p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none resize-none font-mono text-sm"
            placeholder="Write your product strategy here..."
          />
        ) : (
          <div className="prose max-w-none text-slate-600 whitespace-pre-wrap">
            {content || <span className="text-slate-400 italic">No strategy document content yet. Click Edit to add one.</span>}
          </div>
        )}
      </div>
    </div>
  );
}
