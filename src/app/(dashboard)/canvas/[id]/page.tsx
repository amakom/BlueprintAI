'use client';

import { AIChatPanel } from '@/components/layout/AIChatPanel';
import { VisualCanvas } from '@/features/canvas/VisualCanvas';
import { Play, Share2, Download, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CanvasProvider } from '@/features/canvas/CanvasContext';

interface Project {
  id: string;
  name: string;
  team: { name: string };
}

export default function CanvasPage({ params }: { params: { id: string } }) {
  const { limits, isLoading: isSubLoading, plan } = useSubscription();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id]);

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
                  <h1 className="font-bold text-navy">{project.name}</h1>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Draft</span>
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
              <VisualCanvas projectId={project.id} />
          </div>
        </div>
        {/* Right AI Panel */}
        <AIChatPanel />
      </div>
    </CanvasProvider>
  );
}
