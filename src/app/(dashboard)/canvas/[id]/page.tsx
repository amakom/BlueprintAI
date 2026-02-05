'use client';

import { Play, Share2, Download, Lock, Check, X, Edit2, Trash2, History, Sparkles, Pause, FileText, FileJson } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { CanvasProvider } from '@/features/canvas/CanvasContext';
import { VisualCanvas } from '@/features/canvas/VisualCanvas';
import { StrategyView } from '@/components/strategy/StrategyView';
import { SpecView } from '@/components/spec/SpecView';
import { AIChatPanel } from '@/components/layout/AIChatPanel';
import { ActivityLogModal } from '@/features/team/ActivityLogModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { AlertModal } from '@/components/ui/AlertModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Project {
  id: string;
  name: string;
  description?: string;
  team: { name: string };
}

export default function CanvasPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { limits, isLoading: isSubLoading, plan } = useSubscription();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Renaming state
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Activity Log state
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  // View Mode state
  const [mode, setMode] = useState<'canvas' | 'strategy' | 'spec'>('canvas');

  // AI Panel toggle for full-width canvas (Figma-like)
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Play/Preview mode
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project);
          setNewName(data.project.name);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenaming]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowExportMenu(false);
    if (showExportMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showExportMenu]);

  const handleRenameSubmit = async () => {
    if (!project || !newName.trim() || newName === project.name) {
      setIsRenaming(false);
      if (project) setNewName(project.name);
      return;
    }

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        setProject({ ...project, name: newName });
        setIsRenaming(false);
      } else {
        setError('Failed to rename project');
      }
    } catch (error) {
      console.error('Failed to rename project:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleDeleteProject = () => {
    setShowDeleteConfirm(true);
  };

  const performDeleteProject = async () => {
    if (!project) return;

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError('Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleExport = async (format: 'markdown' | 'json') => {
    if (!project || !limits.canExport) return;

    setIsExporting(true);
    setShowExportMenu(false);

    try {
      // Fetch all project data
      const [specRes, okrRes, kpiRes, personaRes, competitorRes, strategyDocRes] = await Promise.all([
        fetch(`/api/projects/${project.id}/spec`),
        fetch(`/api/projects/${project.id}/okrs`),
        fetch(`/api/projects/${project.id}/kpis`),
        fetch(`/api/projects/${project.id}/personas`),
        fetch(`/api/projects/${project.id}/competitors`),
        fetch(`/api/projects/${project.id}/strategy-doc`),
      ]);

      const [specData, okrData, kpiData, personaData, competitorData, strategyDocData] = await Promise.all([
        specRes.json(),
        okrRes.json(),
        kpiRes.json(),
        personaRes.json(),
        competitorRes.json(),
        strategyDocRes.json(),
      ]);

      let content = '';
      let filename = '';
      let mimeType = '';

      if (format === 'markdown') {
        content = generateMarkdownExport(project, {
          spec: specData.spec,
          okrs: okrData.okrs || [],
          kpis: kpiData.kpis || [],
          personas: personaData.personas || [],
          competitors: competitorData.competitors || [],
          strategyDoc: strategyDocData.doc,
        });
        filename = `${project.name.replace(/\s+/g, '_')}_Blueprint.md`;
        mimeType = 'text/markdown';
      } else {
        content = JSON.stringify({
          project: { name: project.name, description: project.description },
          spec: specData.spec,
          okrs: okrData.okrs || [],
          kpis: kpiData.kpis || [],
          personas: personaData.personas || [],
          competitors: competitorData.competitors || [],
          strategyDoc: strategyDocData.doc,
          exportedAt: new Date().toISOString(),
        }, null, 2);
        filename = `${project.name.replace(/\s+/g, '_')}_Blueprint.json`;
        mimeType = 'application/json';
      }

      // Download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export project. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="flex-1 relative bg-navy flex flex-col">
          <header className="h-12 bg-navy border-b border-white/10 flex items-center justify-between px-4 z-10">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20 bg-white/10" />
              <Skeleton className="h-6 w-32 bg-white/10" />
            </div>
          </header>
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <Skeleton className="h-32 w-48 rounded-md bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center bg-navy text-white">
        Project not found
      </div>
    );
  }

  return (
    <CanvasProvider>
      <div className="flex h-full bg-navy">
        {/* Main Canvas Area - Full Width like Figma */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {/* Compact Toolbar - Figma Style */}
          <header className={`h-12 bg-navy border-b border-white/10 flex items-center justify-between px-3 z-10 ${isPreviewMode ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Left: Logo + Project Name */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-7 h-7 bg-cyan rounded-md flex items-center justify-center text-navy font-bold text-sm">B</div>
              </Link>

              <span className="text-white/30">/</span>

              {isRenaming ? (
                <div className="flex items-center gap-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit();
                      if (e.key === 'Escape') {
                        setIsRenaming(false);
                        setNewName(project.name);
                      }
                    }}
                    className="font-medium text-white bg-white/10 border border-cyan/50 rounded px-2 py-0.5 text-sm outline-none focus:ring-1 focus:ring-cyan w-40"
                  />
                  <button onClick={handleRenameSubmit} className="p-1 hover:bg-white/10 text-green-400 rounded">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsRenaming(false);
                      setNewName(project.name);
                    }}
                    className="p-1 hover:bg-white/10 text-red-400 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 group">
                  <span className="font-medium text-white text-sm">{project.name}</span>
                  <button
                    onClick={() => setIsRenaming(true)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 text-white/50 rounded transition-opacity"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-red-400 rounded transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              <span className="px-1.5 py-0.5 bg-white/10 text-white/50 text-[10px] rounded font-medium">Draft</span>
            </div>

            {/* Center: View Mode Tabs */}
            <div className="absolute left-1/2 -translate-x-1/2 flex bg-white/5 rounded-md p-0.5">
              <button
                onClick={() => setMode('canvas')}
                className={`px-4 py-1 text-xs font-medium rounded transition-all ${mode === 'canvas' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
              >
                Canvas
              </button>
              <button
                onClick={() => setMode('strategy')}
                className={`px-4 py-1 text-xs font-medium rounded transition-all ${mode === 'strategy' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
              >
                Strategy
              </button>
              <button
                onClick={() => setMode('spec')}
                className={`px-4 py-1 text-xs font-medium rounded transition-all ${mode === 'spec' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
              >
                Specs
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {/* Collaborators */}
              <div className="flex -space-x-1.5 mr-2">
                <div className="w-6 h-6 rounded-full bg-cyan border-2 border-navy text-[10px] flex items-center justify-center text-navy font-bold">Y</div>
                <div className="w-6 h-6 rounded-full bg-amber border-2 border-navy text-[10px] flex items-center justify-center text-navy font-bold">L</div>
              </div>

              {/* Live Indicator */}
              {limits.canRealTimeEdit && (
                <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold px-2 mr-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  LIVE
                </div>
              )}

              {/* Activity Log */}
              <button
                onClick={() => setIsActivityOpen(true)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Activity Log"
              >
                <History className="w-4 h-4" />
              </button>

              {/* Play/Preview Mode */}
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`p-2 rounded transition-colors ${isPreviewMode ? 'bg-cyan text-navy' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                title={isPreviewMode ? 'Exit Preview' : 'Preview Mode'}
              >
                {isPreviewMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              {/* Export Button */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!limits.canExport) {
                      setError('Upgrade to Pro or Team to export your blueprint');
                      return;
                    }
                    setShowExportMenu(!showExportMenu);
                  }}
                  disabled={isExporting}
                  className={`p-2 rounded transition-colors flex items-center gap-1 ${
                    limits.canExport
                      ? 'text-white/60 hover:text-white hover:bg-white/10'
                      : 'text-white/30 cursor-not-allowed'
                  }`}
                  title={limits.canExport ? 'Export' : 'Upgrade to Export'}
                >
                  <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
                  {!limits.canExport && <Lock className="w-3 h-3" />}
                </button>

                {/* Export Dropdown */}
                {showExportMenu && limits.canExport && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-xl border border-gray-200 py-1 min-w-[160px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => handleExport('markdown')}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      Export as Markdown
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileJson className="w-4 h-4 text-gray-400" />
                      Export as JSON
                    </button>
                  </div>
                )}
              </div>

              {/* AI Panel Toggle */}
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`p-2 rounded transition-colors ${showAIPanel ? 'bg-cyan text-navy' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                title="AI Assistant"
              >
                <Sparkles className="w-4 h-4" />
              </button>

              {/* Share */}
              <button
                className="bg-white text-navy px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 hover:bg-gray-100 transition-colors ml-1"
                onClick={() => {
                  if (limits.maxCollaborators <= 2) {
                    setError('Upgrade to Pro to add more collaborators!');
                  }
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </header>

          {/* Preview Mode Banner */}
          {isPreviewMode && (
            <div className="bg-cyan text-navy px-4 py-2 flex items-center justify-between text-sm font-medium z-20">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Preview Mode - Interact with your blueprint as users would see it
              </div>
              <button
                onClick={() => setIsPreviewMode(false)}
                className="px-3 py-1 bg-navy text-white rounded text-xs font-bold hover:bg-navy/80"
              >
                Exit Preview
              </button>
            </div>
          )}

          {/* Canvas Content - Maximum Space */}
          <div className={`flex-1 relative overflow-hidden ${mode === 'canvas' ? 'bg-navy' : 'bg-cloud'}`}>
            {mode === 'canvas' ? (
              <VisualCanvas projectId={project.id} />
            ) : mode === 'strategy' ? (
              <StrategyView projectId={project.id} />
            ) : (
              <SpecView projectId={project.id} />
            )}
          </div>
        </div>

        {/* AI Panel - Slide-in from Right (Figma Properties Panel Style) */}
        {showAIPanel && (
          <div className="w-80 border-l border-white/10 bg-white flex-shrink-0 animate-in slide-in-from-right duration-200">
            <AIChatPanel />
          </div>
        )}
      </div>

      {/* Activity Log Modal */}
      <ActivityLogModal
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        projectId={params.id}
      />

      <AlertModal isOpen={!!error} onClose={() => setError(null)} message={error || ''} />
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={performDeleteProject}
        title="Delete Project?"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete Project"
      />
    </CanvasProvider>
  );
}

// Generate Markdown export
function generateMarkdownExport(
  project: Project,
  data: {
    spec: any;
    okrs: any[];
    kpis: any[];
    personas: any[];
    competitors: any[];
    strategyDoc: any;
  }
) {
  const lines: string[] = [];

  lines.push(`# ${project.name} - Product Blueprint`);
  lines.push('');
  if (project.description) {
    lines.push(`> ${project.description}`);
    lines.push('');
  }
  lines.push(`*Exported from BlueprintAI on ${new Date().toLocaleDateString()}*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Strategy Document
  if (data.strategyDoc?.content?.text) {
    lines.push('## Strategy Document');
    lines.push('');
    lines.push(data.strategyDoc.content.text);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // OKRs
  if (data.okrs.length > 0) {
    lines.push('## OKRs (Objectives & Key Results)');
    lines.push('');
    data.okrs.forEach((okr, i) => {
      lines.push(`### Objective ${i + 1}: ${okr.objective}`);
      lines.push('');
      if (Array.isArray(okr.keyResults)) {
        okr.keyResults.forEach((kr: string) => {
          lines.push(`- ${kr}`);
        });
      }
      lines.push('');
    });
    lines.push('---');
    lines.push('');
  }

  // KPIs
  if (data.kpis.length > 0) {
    lines.push('## KPIs (Key Performance Indicators)');
    lines.push('');
    lines.push('| KPI | Target | Status |');
    lines.push('|-----|--------|--------|');
    data.kpis.forEach((kpi) => {
      lines.push(`| ${kpi.name} | ${kpi.target} | ${(kpi.status || 'N/A').replace('_', ' ')} |`);
    });
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // Personas
  if (data.personas.length > 0) {
    lines.push('## User Personas');
    lines.push('');
    data.personas.forEach((persona) => {
      lines.push(`### ${persona.name} - ${persona.role}`);
      lines.push('');
      if (persona.bio) {
        lines.push(`**Bio:** ${persona.bio}`);
        lines.push('');
      }
      if (persona.goals?.length > 0) {
        lines.push('**Goals:**');
        persona.goals.forEach((g: string) => lines.push(`- ${g}`));
        lines.push('');
      }
      if (persona.frustrations?.length > 0) {
        lines.push('**Frustrations:**');
        persona.frustrations.forEach((f: string) => lines.push(`- ${f}`));
        lines.push('');
      }
    });
    lines.push('---');
    lines.push('');
  }

  // Competitors
  if (data.competitors.length > 0) {
    lines.push('## Competitor Analysis');
    lines.push('');
    data.competitors.forEach((comp) => {
      lines.push(`### ${comp.name}`);
      if (comp.website) lines.push(`Website: ${comp.website}`);
      lines.push('');
      if (comp.strengths?.length > 0) {
        lines.push('**Strengths:**');
        comp.strengths.forEach((s: string) => lines.push(`- ${s}`));
        lines.push('');
      }
      if (comp.weaknesses?.length > 0) {
        lines.push('**Weaknesses:**');
        comp.weaknesses.forEach((w: string) => lines.push(`- ${w}`));
        lines.push('');
      }
    });
    lines.push('---');
    lines.push('');
  }

  // Technical Spec
  if (data.spec) {
    lines.push('## Technical Specifications');
    lines.push('');
    if (data.spec.overview) {
      lines.push('### Overview');
      lines.push(data.spec.overview);
      lines.push('');
    }
    if (data.spec.architecture) {
      lines.push('### Architecture');
      lines.push('```');
      lines.push(typeof data.spec.architecture === 'string' ? data.spec.architecture : JSON.stringify(data.spec.architecture, null, 2));
      lines.push('```');
      lines.push('');
    }
    if (data.spec.dataModel) {
      lines.push('### Data Model');
      lines.push('```');
      lines.push(typeof data.spec.dataModel === 'string' ? data.spec.dataModel : JSON.stringify(data.spec.dataModel, null, 2));
      lines.push('```');
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('*Generated by BlueprintAI - Plan it. See it. Build it.*');

  return lines.join('\n');
}
