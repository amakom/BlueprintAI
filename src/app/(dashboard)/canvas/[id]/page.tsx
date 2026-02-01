'use client';

import { Play, Share2, Download, Lock, Check, X, Edit2, Trash2, History } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { CanvasProvider } from '@/features/canvas/CanvasContext';
import { VisualCanvas } from '@/features/canvas/VisualCanvas';
import { StrategyView } from '@/components/strategy/StrategyView';
import { AIChatPanel } from '@/components/layout/AIChatPanel';
import { ActivityLogModal } from '@/features/team/ActivityLogModal';

interface Project {
  id: string;
  name: string;
  team: { name: string };
}

export default function CanvasPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { limits, isLoading: isSubLoading, plan } = useSubscription();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Renaming state
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Activity Log state
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  // View Mode state
  const [mode, setMode] = useState<'canvas' | 'strategy'>('canvas');

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
        alert('Failed to rename project');
      }
    } catch (error) {
      console.error('Failed to rename project:', error);
      alert('An unexpected error occurred');
    }
  };

  const handleDeleteProject = async () => {
    if (!project || !window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('An unexpected error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-cloud text-navy">
        Loading...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center bg-cloud text-navy">
        Project not found
      </div>
    );
  }

  return (
    <CanvasProvider>
      <div className="flex h-full">
        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-cloud overflow-hidden flex flex-col">
          {/* Top Bar */}
          <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 z-10 relative shadow-sm">
              <div className="flex items-center gap-2">
                  <Link href="/dashboard" className="text-gray-400 hover:text-navy transition-colors">Projects</Link>
                  <span className="text-gray-300">/</span>
                  
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
                        className="font-bold text-navy border border-cyan rounded px-2 py-1 outline-none focus:ring-2 focus:ring-cyan/20 w-48"
                      />
                      <button onClick={handleRenameSubmit} className="p-1 hover:bg-green-50 text-green-600 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setIsRenaming(false);
                          setNewName(project.name);
                        }} 
                        className="p-1 hover:bg-red-50 text-red-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <h1 className="font-bold text-navy">{project.name}</h1>
                      <button 
                        onClick={() => setIsRenaming(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-cloud rounded text-gray-400 hover:text-navy"
                        title="Rename Project"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={handleDeleteProject}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Draft</span>
                  
                  {/* View Mode Toggle */}
                  <div className="flex bg-slate-100 rounded-lg p-1 mx-4">
                    <button
                      onClick={() => setMode('canvas')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${mode === 'canvas' ? 'bg-white shadow-sm text-navy' : 'text-slate-500 hover:text-navy'}`}
                    >
                      Canvas
                    </button>
                    <button
                      onClick={() => setMode('strategy')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${mode === 'strategy' ? 'bg-white shadow-sm text-navy' : 'text-slate-500 hover:text-navy'}`}
                    >
                      Strategy
                    </button>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 mr-2">
                      <div className="w-8 h-8 rounded-full bg-cyan border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-amber border-2 border-white"></div>
                  </div>
                  
                  {/* Real-time Indicator (Mock) */}
                  {limits.canRealTimeEdit ? (
                      <div className="flex items-center gap-1 text-xs text-green-600 font-bold px-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          LIVE
                      </div>
                  ) : (
                      !isSubLoading && plan !== 'TEAM' && plan !== 'ENTERPRISE' && (
                          <Link href="/pricing" className="text-xs text-amber font-bold flex items-center gap-1 hover:underline">
                             <Lock className="w-3 h-3" /> Team Sync Locked
                          </Link>
                      )
                  )}

                  <button 
                      onClick={() => setIsActivityOpen(true)}
                      className="text-navy hover:bg-gray-100 p-2 rounded-md"
                      title="Activity Log"
                  >
                      <History className="w-4 h-4" />
                  </button>

                  <button className="text-navy hover:bg-gray-100 p-2 rounded-md">
                      <Play className="w-4 h-4" />
                  </button>

                   {/* Export Button (Gated) */}
                   <button 
                      disabled={!limits.canExport}
                      className={`p-2 rounded-md flex items-center gap-2 ${
                          limits.canExport 
                          ? 'text-navy hover:bg-gray-100' 
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                      title={limits.canExport ? "Export Specs" : "Upgrade to Export"}
                   >
                      <Download className="w-4 h-4" />
                      {!limits.canExport && <Lock className="w-3 h-3 ml-1" />}
                   </button>

                   <button 
                      className="bg-navy text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2"
                      onClick={() => {
                          if (limits.maxCollaborators <= 2) { // Assume current count is 2 for demo
                              alert('Upgrade to Pro to add more collaborators!');
                          }
                      }}
                   >
                      <Share2 className="w-4 h-4" />
                      Share
                  </button>
              </div>
          </header>
          
          {/* Actual Canvas Implementation */}
          <div className="flex-1 relative">
              {mode === 'canvas' ? (
                <VisualCanvas projectId={project.id} />
              ) : (
                <StrategyView projectId={project.id} />
              )}
          </div>
        </div>
        {/* Right AI Panel */}
        <AIChatPanel />
      </div>
      <ActivityLogModal
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        projectId={params.id}
      />
    </CanvasProvider>
  );
}
