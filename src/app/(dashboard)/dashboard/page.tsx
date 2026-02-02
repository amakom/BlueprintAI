'use client';

import { Plus, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateProjectModal } from '@/components/dashboard/CreateProjectModal';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { AlertModal } from '@/components/ui/AlertModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Project {
  id: string;
  name: string;
  updatedAt: string;
  team: { name: string };
  _count: { documents: number };
}

export default function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Simulate network delay for skeleton demo
      // await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async ({ name, description, type, aiPrompt }: { name: string; description: string; type: string; aiPrompt: string }) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, type, aiPrompt }),
      });

      const data = await res.json();
      
      if (res.ok && data.project) {
        router.push(`/canvas/${data.project.id}`);
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleRenameProject = async (id: string, newName: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
        );
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to rename project');
      }
    } catch (error) {
      console.error('Failed to rename project:', error);
      setError('An unexpected error occurred');
    }
  };

  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
  };

  const performDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      const res = await fetch(`/api/projects/${projectToDelete}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectToDelete));
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      setError('An unexpected error occurred');
    } finally {
      setProjectToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 pt-16 md:pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-md border border-border p-6 h-[200px] flex flex-col justify-between">
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 pt-16 md:pt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Projects</h1>
          <p className="text-gray-500">Manage and organize your product blueprints</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-navy text-white rounded-md hover:bg-navy/90 transition-colors font-medium shadow-lg shadow-navy/20 w-full md:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        // Guided Empty State
        <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-md">
          <div className="w-16 h-16 bg-cyan/10 rounded-md flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-cyan" />
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Start Your First Blueprint</h2>
          <p className="text-gray-500 max-w-md text-center mb-8">
            Create a new project to start visualizing your product requirements. 
            Use our AI assistant to generate your initial structure in seconds.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-cyan text-navy rounded-md hover:bg-cyan/90 transition-all font-bold shadow-lg shadow-cyan/20 hover:scale-105"
          >
            Create Project <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.name}
              updatedAt={project.updatedAt}
              documentCount={project._count.documents}
              teamName={project.team.name}
              onRename={handleRenameProject}
              onDelete={async (id) => confirmDelete(id)}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
      
      <AlertModal isOpen={!!error} onClose={() => setError(null)} message={error || ''} />
      <ConfirmModal 
        isOpen={!!projectToDelete} 
        onClose={() => setProjectToDelete(null)} 
        onConfirm={performDelete}
        title="Delete Project?"
        message="Are you sure you want to delete this project? This action cannot be undone and all associated documents will be lost."
        confirmText="Delete Project"
      />
    </div>
  );
}
