'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Untitled Project' }),
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
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy">Welcome back, User</h1>
          <p className="text-gray-500 mt-1">Here&#39;s what&#39;s happening with your projects.</p>
        </div>
        <button 
          onClick={handleCreateProject}
          disabled={isCreating}
          className="bg-cyan hover:bg-cyan/90 text-navy font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Creating...' : 'New Project'}
        </button>
      </header>

      <section>
        <h2 className="text-lg font-bold text-navy mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project Card 1 */}
          <div className="bg-white p-5 rounded-xl border border-border hover:border-cyan transition-colors cursor-pointer shadow-sm group">
            <div className="h-32 bg-cloud rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 font-medium">Preview</span>
            </div>
            <h3 className="font-bold text-navy group-hover:text-cyan transition-colors">Mobile App PRD</h3>
            <p className="text-sm text-gray-500 mt-1">Edited 2 hours ago</p>
          </div>

          {/* Project Card 2 */}
          <div className="bg-white p-5 rounded-xl border border-border hover:border-cyan transition-colors cursor-pointer shadow-sm group">
            <div className="h-32 bg-cloud rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 font-medium">Preview</span>
            </div>
            <h3 className="font-bold text-navy group-hover:text-cyan transition-colors">Website Redesign</h3>
            <p className="text-sm text-gray-500 mt-1">Edited yesterday</p>
          </div>
          
           {/* Create New Card */}
           <div 
             onClick={handleCreateProject}
             className={`bg-cloud/50 border-2 border-dashed border-gray-300 p-5 rounded-xl flex flex-col items-center justify-center hover:border-cyan hover:bg-cyan/5 transition-colors cursor-pointer h-full min-h-[240px] ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                <Plus className="w-5 h-5 text-cyan" />
            </div>
            <h3 className="font-bold text-navy">{isCreating ? 'Creating...' : 'Create New'}</h3>
          </div>
        </div>
      </section>
    </div>
  );
}
