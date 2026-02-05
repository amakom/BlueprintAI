'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { useCanvas } from './CanvasContext';

export function SidebarPropertiesPanel() {
  const { nodes, setNodes } = useCanvas();
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Find selected node from context
  const selectedNodes = nodes.filter((n) => n.selected);

  useEffect(() => {
    if (selectedNodes.length === 1) {
      setSelectedNode(selectedNodes[0]);
    } else {
      setSelectedNode(null);
    }
  }, [selectedNodes.length, selectedNodes[0]?.id]);

  if (!selectedNode) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        Select an element on the canvas to edit its properties.
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
            style: key === 'backgroundColor' ? { ...n.style, backgroundColor: value } : n.style,
          };
        }
        return n;
      })
    );
    // Update local state for UI responsiveness
    setSelectedNode((prev: any) => ({
      ...prev,
      data: { ...prev.data, [key]: value },
      style: key === 'backgroundColor' ? { ...prev.style, backgroundColor: value } : prev.style,
    }));
  };

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setSelectedNode(null);
  };

  const isScreen = selectedNode.type === 'screen';

  return (
    <div className="p-4 space-y-4">
      {/* Label */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase">Label</label>
        <input
          type="text"
          value={selectedNode.data?.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-cyan text-navy"
        />
      </div>

      {/* Screen Specific Properties */}
      {isScreen && (
        <>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Dimensions</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, style: { ...n.style, width: 390, height: 844 } } : n));
                }}
                className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded-md hover:border-cyan hover:bg-cyan/5 transition-colors"
              >
                <Smartphone className="w-4 h-4 mb-1 text-gray-600" />
                <span className="text-[10px] text-gray-500">iPhone</span>
              </button>
              <button
                onClick={() => {
                  setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, style: { ...n.style, width: 1440, height: 900 } } : n));
                }}
                className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded-md hover:border-cyan hover:bg-cyan/5 transition-colors"
              >
                <Monitor className="w-4 h-4 mb-1 text-gray-600" />
                <span className="text-[10px] text-gray-500">Desktop</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedNode.style?.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-8 h-8 rounded-md cursor-pointer border-none p-0"
              />
              <span className="text-xs text-gray-500 font-mono">{selectedNode.style?.backgroundColor || '#ffffff'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-md p-3 text-center hover:bg-gray-50 transition-colors relative">
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
              <ImageIcon className="w-5 h-5 mx-auto text-gray-400 mb-1" />
              <p className="text-[10px] text-gray-500">Click to upload</p>
            </div>
            {selectedNode.data?.image && (
              <button
                onClick={() => handleChange('image', null)}
                className="text-[10px] text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove Image
              </button>
            )}
          </div>
        </>
      )}

      {/* Delete Button */}
      <div className="pt-3 border-t border-gray-100">
        <button
          onClick={handleDelete}
          className="w-full py-2 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Element
        </button>
      </div>
    </div>
  );
}
