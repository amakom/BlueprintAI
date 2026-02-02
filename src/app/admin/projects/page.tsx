'use client';

import { useEffect, useState } from 'react';
import { Folder, Search, Trash2, Archive, Eye } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Project {
  id: string;
  name: string;
  teamName: string;
  ownerEmail: string;
  documentCount: number;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    setActionLoading(projectToDelete);
    try {
        const res = await fetch(`/api/admin/projects/${projectToDelete}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            setProjects(projects.filter(p => p.id !== projectToDelete));
        }
    } catch (error) {
        console.error('Failed to delete project', error);
    } finally {
        setActionLoading(null);
        setProjectToDelete(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.teamName.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Folder className="w-6 h-6" />
          Projects ({projects.length})
        </h1>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan/20 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Project Name</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4">AI Outputs</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading projects...</td>
              </tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No projects found</td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-navy">{project.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                    {project.ownerEmail}
                    <div className="text-xs text-gray-400">{project.teamName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    <button className="flex items-center gap-2 text-cyan hover:text-cyan/80 text-sm font-medium">
                        <Eye className="w-4 h-4" />
                        {project.documentCount} Outputs (View)
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setProjectToDelete(project.id)}
                            disabled={actionLoading === project.id}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                            title="Archive"
                        >
                            <Archive className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}
