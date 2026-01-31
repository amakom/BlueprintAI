import { Handle, Position, NodeProps, Node, useReactFlow } from '@xyflow/react';
import { User, Trash2 } from 'lucide-react';
import { useState, useCallback } from 'react';

type UserStoryData = {
  label: string;
  description?: string;
};

export function UserStoryNode({ id, data, selected }: NodeProps<Node<UserStoryData>>) {
  const { setNodes, deleteElements } = useReactFlow();
  
  const updateLabel = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, label: evt.target.value } };
      }
      return node;
    }));
  }, [id, setNodes]);

  const updateDescription = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, description: evt.target.value } };
      }
      return node;
    }));
  }, [id, setNodes]);

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  return (
    <div className={`w-52 bg-white rounded-lg border-2 shadow-sm transition-all group/node ${
      selected ? 'border-cyan ring-2 ring-cyan/20' : 'border-border'
    }`}>
      {/* Header */}
      <div className="bg-cloud p-2 rounded-t-md border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="bg-amber/10 p-1 rounded">
            <User className="w-3 h-3 text-amber" />
            </div>
            <span className="font-bold text-xs text-navy">User Story</span>
        </div>
        <button 
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover/node:opacity-100 transition-opacity"
            title="Delete Node"
        >
            <Trash2 className="w-3 h-3" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-2">
        <input
            className="text-sm font-medium text-navy mb-1 w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyan/50 rounded px-1"
            value={data.label}
            onChange={updateLabel}
            placeholder="User Story Title"
        />
        <textarea
            className="text-[10px] text-gray-500 w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyan/50 rounded px-1 resize-none"
            value={data.description || ''}
            onChange={updateDescription}
            placeholder="As a user, I want to..."
            rows={3}
        />
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-navy border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-navy border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-cyan border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-cyan border-2 border-white" />
    </div>
  );
}
