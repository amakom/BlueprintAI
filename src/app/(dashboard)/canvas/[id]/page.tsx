'use client';

import { Play, Share2, Download, Lock, Check, X, Edit2, Trash2, History, Pause, FileText, FileJson, Plus, Smartphone, Monitor, Layout, ChevronDown, ChevronUp, Home } from 'lucide-react';
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
import { PropertiesPanel } from '@/features/canvas/PropertiesPanel';

interface Project {
  id: string;
  name: string;
  description?: string;
  team: { name: string };
}

export default function CanvasPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { limits } = useSubscription();
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

  // Play/Preview mode
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Left Sidebar sections collapse state
  const [libraryExpanded, setLibraryExpanded] = useState(true);
  const [propertiesExpanded, setPropertiesExpanded] = useState(true);

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
        <div className="w-64 bg-white border-r border-border p-4">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="flex-1 relative bg-navy flex items-center justify-center">
          <Skeleton className="h-32 w-48 rounded-md bg-white/5" />
        </div>
        <div className="w-80 bg-white border-l border-border">
          <Skeleton className="h-full w-full" />
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
      <div className="flex h-full bg-cloud">
        {/* LEFT SIDEBAR - Main Menu + Library + Properties */}
        <div className={`w-64 bg-white border-r border-border flex flex-col shrink-0 ${isPreviewMode ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Logo & Project Name Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-cyan rounded-md flex items-center justify-center text-navy font-bold text-sm">B</div>
              </Link>
              <span className="text-gray-400">/</span>
              {isRenaming ? (
                <div className="flex items-center gap-1 flex-1">
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
                    className="font-medium text-navy bg-gray-100 border border-cyan/50 rounded px-2 py-0.5 text-sm outline-none focus:ring-1 focus:ring-cyan flex-1 min-w-0"
                  />
                  <button onClick={handleRenameSubmit} className="p-1 hover:bg-gray-100 text-green-600 rounded">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsRenaming(false);
                      setNewName(project.name);
                    }}
                    className="p-1 hover:bg-gray-100 text-red-500 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 group flex-1 min-w-0">
                  <span className="font-medium text-navy text-sm truncate">{project.name}</span>
                  <button
                    onClick={() => setIsRenaming(true)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 text-gray-400 rounded transition-opacity shrink-0"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-500 hover:text-navy hover:bg-gray-100 rounded transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <button
                onClick={() => setIsActivityOpen(true)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-500 hover:text-navy hover:bg-gray-100 rounded transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                Activity
              </button>
              <button
                onClick={handleDeleteProject}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors ml-auto"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="px-3 py-2 border-b border-border">
            <div className="flex bg-gray-100 rounded-md p-0.5">
              <button
                onClick={() => setMode('canvas')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-all ${mode === 'canvas' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}
              >
                Canvas
              </button>
              <button
                onClick={() => setMode('strategy')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-all ${mode === 'strategy' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}
              >
                Strategy
              </button>
              <button
                onClick={() => setMode('spec')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-all ${mode === 'spec' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}
              >
                Specs
              </button>
            </div>
          </div>

          {/* Scrollable Content: Library + Properties */}
          <div className="flex-1 overflow-y-auto">
            {mode === 'canvas' && (
              <>
                {/* Library Section */}
                <div className="border-b border-border">
                  <button
                    onClick={() => setLibraryExpanded(!libraryExpanded)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-navy uppercase tracking-wider">Library</span>
                    {libraryExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>

                  {libraryExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase mb-2">Drag to canvas</p>

                      {/* Nodes */}
                      <div className="space-y-1.5">
                        <LibraryItem
                          icon={<Plus size={12} />}
                          label="User Story"
                          description="Define requirements"
                          nodeType="userStory"
                          bgColor="bg-navy"
                          iconColor="text-white"
                        />
                        <LibraryItem
                          icon={<Smartphone size={12} />}
                          label="Screen"
                          description="Generic Screen"
                          nodeType="screen"
                          bgColor="bg-white border border-gray-200"
                          iconColor="text-navy"
                        />
                      </div>

                      {/* Frames */}
                      <div className="pt-2">
                        <p className="text-[10px] text-gray-400 uppercase mb-2">Frames</p>
                        <div className="space-y-1.5">
                          <LibraryItem
                            icon={<Smartphone size={12} />}
                            label="Mobile App"
                            description="390 x 844"
                            nodeType="screen"
                            initialData={{ label: 'iPhone 14', style: { width: 390, height: 844 } }}
                            bgColor="bg-gray-100"
                            iconColor="text-gray-600"
                          />
                          <LibraryItem
                            icon={<Monitor size={12} />}
                            label="Web App"
                            description="1440 x 900"
                            nodeType="screen"
                            initialData={{ label: 'Web Desktop', style: { width: 1440, height: 900 } }}
                            bgColor="bg-gray-100"
                            iconColor="text-gray-600"
                          />
                          <LibraryItem
                            icon={<Layout size={12} />}
                            label="Social Post"
                            description="1080 x 1080"
                            nodeType="screen"
                            initialData={{ label: 'Social Post', style: { width: 1080, height: 1080 } }}
                            bgColor="bg-gray-100"
                            iconColor="text-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Properties Section */}
                <div>
                  <button
                    onClick={() => setPropertiesExpanded(!propertiesExpanded)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-navy uppercase tracking-wider">Properties</span>
                    {propertiesExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>

                  {propertiesExpanded && (
                    <div className="px-0">
                      <PropertiesPanel />
                    </div>
                  )}
                </div>
              </>
            )}

            {mode !== 'canvas' && (
              <div className="p-4 text-center text-gray-400 text-sm">
                <p>Switch to Canvas view to access Library and Properties.</p>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-border space-y-2">
            {/* Preview Mode Toggle */}
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isPreviewMode
                  ? 'bg-cyan text-navy'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isPreviewMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPreviewMode ? 'Exit Preview' : 'Preview Mode'}
            </button>

            {/* Export & Share */}
            <div className="flex gap-2">
              <div className="relative flex-1">
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
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    limits.canExport
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
                  Export
                  {!limits.canExport && <Lock className="w-3 h-3" />}
                </button>

                {showExportMenu && limits.canExport && (
                  <div className="absolute bottom-full left-0 mb-1 w-full bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <button
                      onClick={() => handleExport('markdown')}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      Markdown
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileJson className="w-4 h-4 text-gray-400" />
                      JSON
                    </button>
                  </div>
                )}
              </div>

              <button
                className="flex-1 bg-navy text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-navy/90 transition-colors"
                onClick={() => {
                  if (limits.maxCollaborators <= 2) {
                    setError('Upgrade to Pro to add more collaborators!');
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* CENTER - Canvas Content */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
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

          {/* Canvas/Strategy/Spec View */}
          <div className={`flex-1 relative overflow-hidden ${mode === 'canvas' ? 'bg-navy' : 'bg-cloud'}`}>
            {mode === 'canvas' ? (
              <VisualCanvas projectId={project.id} hideSidebars={true} />
            ) : mode === 'strategy' ? (
              <StrategyView projectId={project.id} />
            ) : (
              <SpecView projectId={project.id} />
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR - AI Chat Panel (Always Visible) */}
        <div className="w-80 border-l border-border bg-white flex-shrink-0">
          <AIChatPanel />
        </div>
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

// Library Item Component for drag-and-drop
function LibraryItem({
  icon,
  label,
  description,
  nodeType,
  initialData,
  bgColor,
  iconColor
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  nodeType: string;
  initialData?: any;
  bgColor: string;
  iconColor: string;
}) {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    if (initialData) {
      event.dataTransfer.setData('application/reactflow/data', JSON.stringify(initialData));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="p-2.5 border border-gray-200 rounded-md bg-gray-50 cursor-grab active:cursor-grabbing hover:border-navy hover:shadow-sm transition-all group"
      onDragStart={onDragStart}
      draggable
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 ${bgColor} ${iconColor} rounded-md group-hover:bg-cyan group-hover:text-navy transition-colors`}>
          {icon}
        </div>
        <div>
          <span className="font-medium text-navy text-xs block">{label}</span>
          <span className="text-[10px] text-gray-400">{description}</span>
        </div>
      </div>
    </div>
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
