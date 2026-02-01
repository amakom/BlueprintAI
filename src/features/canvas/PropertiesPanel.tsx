'use client';

import { useReactFlow } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { X, Smartphone, Monitor, Layout, Image as ImageIcon, Trash2 } from 'lucide-react';

export function PropertiesPanel() {
  const { getNodes, setNodes, getEdges, deleteElements } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Listen for selection changes
  // Note: React Flow's useOnSelectionChange is a hook, but we can also just poll or use internal state if we were inside the store. 
  // A simpler way in a component is to use an effect on nodes/edges changes, but that's heavy.
  // Better: useOnSelectionChange hook.
  
  // Actually, let's just use the selected prop from nodes.
  const nodes = getNodes();
  const selectedNodes = nodes.filter((n) => n.selected);
  const hasSelection = selectedNodes.length > 0;
  
  // Update local state when selection changes
  useEffect(() => {
    if (selectedNodes.length === 1) {
      setSelectedNode(selectedNodes[0]);
    } else {
      setSelectedNode(null);
    }
  }, [hasSelection, selectedNodes.length, selectedNodes[0]?.id]);

  if (!selectedNode) {
    return (
      <div className="w-64 bg-white border-l border-slate-200 p-4 flex flex-col gap-4 shrink-0 h-full">
        <div className="text-sm font-medium text-slate-400 text-center mt-10">
          Select an element to edit properties
        </div>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          return {
            ...n,
            data: {
              ...n.data,
              [key]: value,
            },
            // Update style for direct visual changes if needed, but we usually map data to style in the Node component
            // For width/height, React Flow uses style.width/height or measured.
            style: key === 'backgroundColor' ? { ...n.style, backgroundColor: value } : n.style,
          };
        }
        return n;
      })
    );
    // Update local state immediately for UI responsiveness
    setSelectedNode((prev: any) => ({
      ...prev,
      data: { ...prev.data, [key]: value },
      style: key === 'backgroundColor' ? { ...prev.style, backgroundColor: value } : prev.style,
    }));
  };

  const handleDelete = () => {
    deleteElements({ nodes: [{ id: selectedNode.id }] });
    setSelectedNode(null);
  };

  const isScreen = selectedNode.type === 'screen';

  return (
    <div className="w-64 bg-white border-l border-slate-200 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-navy text-sm uppercase tracking-wider">Properties</h3>
        <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-navy">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Common Properties */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 uppercase">Label</label>
          <input
            type="text"
            value={selectedNode.data.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-cyan"
          />
        </div>

        {/* Screen Specific Properties */}
        {isScreen && (
          <>
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase">Dimensions</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, style: { ...n.style, width: 390, height: 844 } } : n));
                  }}
                  className="flex flex-col items-center justify-center p-2 border border-slate-200 rounded hover:border-cyan hover:bg-cyan/5 transition-colors"
                >
                  <Smartphone className="w-4 h-4 mb-1 text-slate-600" />
                  <span className="text-[10px] text-slate-500">iPhone</span>
                </button>
                <button 
                  onClick={() => {
                    setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, style: { ...n.style, width: 1440, height: 900 } } : n));
                  }}
                  className="flex flex-col items-center justify-center p-2 border border-slate-200 rounded hover:border-cyan hover:bg-cyan/5 transition-colors"
                >
                  <Monitor className="w-4 h-4 mb-1 text-slate-600" />
                  <span className="text-[10px] text-slate-500">Desktop</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-xs font-semibold text-slate-500 uppercase">Background</label>
               <div className="flex items-center gap-2">
                 <input 
                    type="color" 
                    value={selectedNode.style?.backgroundColor || '#ffffff'}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-none p-0"
                 />
                 <span className="text-xs text-slate-500 font-mono">{selectedNode.style?.backgroundColor || '#ffffff'}</span>
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-xs font-semibold text-slate-500 uppercase">Image</label>
               <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors relative">
                 <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                handleChange('image', event.target?.result);
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                 />
                 <ImageIcon className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                 <p className="text-xs text-slate-500">Click to upload image</p>
               </div>
               {selectedNode.data.image && (
                 <button 
                    onClick={() => handleChange('image', null)}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                 >
                    <X className="w-3 h-3" /> Remove Image
                 </button>
               )}
            </div>
          </>
        )}

        <div className="pt-4 border-t border-slate-100">
            <button 
                onClick={handleDelete}
                className="w-full py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
                <Trash2 className="w-4 h-4" />
                Delete Element
            </button>
        </div>
      </div>
    </div>
  );
}
