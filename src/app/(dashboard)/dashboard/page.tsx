'use client';

import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateProjectModal } from '@/components/dashboard/CreateProjectModal';
import { ProjectCard } from '@/components/dashboard/ProjectCard';

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
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

  const handleCreateProject = async ({ name, description }: { name: string; description: string }) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();
      
      if (res.ok && data.project) {
        router.push(`/canvas/${data.project.id}`);
      } else {
        alert(data.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('An unexpected error occurred');
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
        alert(data.error || 'Failed to rename project');
      }
    } catch (error) {
      console.error('Failed to rename project:', error);
      alert('An unexpected error occurred');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('An unexpected error occurred');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy">Welcome back</h1>
          <p className="text-gray-500 mt-1">Here&#39;s what&#39;s happening with your projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan hover:bg-cyan/90 text-navy font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </header>

      <section>
        <h2 className="text-lg font-bold text-navy mb-4">Recent Projects</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[240px] bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <div 
              onClick={() => setIsModalOpen(true)}
              className="bg-cloud/50 border-2 border-dashed border-gray-300 p-5 rounded-xl flex flex-col items-center justify-center hover:border-cyan hover:bg-cyan/5 transition-colors cursor-pointer h-full min-h-[240px]"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                <Plus className="w-4 h-4 text-cyan" />
              </div>
              <h3 className="font-bold text-navy">Create New</h3>
            </div>

            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onRename={handleRenameProject}
                onDelete={handleDeleteProject}
              />
            ))}
            
            {projects.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400">
                No projects found. Create one to get started!
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
