import { useState, useEffect } from 'react';
import { useCanvas } from './CanvasContext';
import { RotateCcw, X, Clock } from 'lucide-react';

interface Version {
  id: string;
  createdAt: string;
  commitMsg: string | null;
}

export function VersionHistory({ onClose }: { onClose: () => void }) {
  const { projectId, setNodes, setEdges } = useCanvas();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}/versions`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVersions(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  const restoreVersion = async (versionId: string) => {
    if (!confirm('Are you sure you want to restore this version? Current changes will be lost unless saved.')) return;
    
    try {
        const res = await fetch(`/api/versions/${versionId}`);
        const version = await res.json();
        if (version.content) {
            const { nodes, edges } = version.content;
            setNodes(nodes || []);
            setEdges(edges || []);
            onClose();
        }
    } catch (err) {
        console.error(err);
        alert('Failed to restore version');
    }
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 className="font-bold text-navy flex items-center gap-2 text-sm">
            <Clock size={16} /> Version History
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
            </div>
        ) : versions.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No versions found.</p>
        ) : (
            versions.map(v => (
                <div key={v.id} className="p-3 rounded-lg border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/30 group transition-all">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-gray-900">
                            {new Date(v.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-gray-500">
                            {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 truncate font-mono bg-gray-50 p-1 rounded">
                        {v.commitMsg || 'Auto-saved version'}
                    </p>
                    <button 
                        onClick={() => restoreVersion(v.id)}
                        className="text-xs w-full bg-white border border-gray-200 text-gray-700 py-1.5 rounded shadow-sm hover:bg-navy hover:text-white hover:border-navy flex items-center justify-center gap-1.5 transition-all duration-200 font-medium"
                    >
                        <RotateCcw size={12} /> Restore Version
                    </button>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
