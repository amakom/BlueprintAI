import { Handle, Position, NodeProps, Node, useReactFlow, NodeResizer } from '@xyflow/react';
import { User, Trash2 } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';

type UserStoryData = {
  label: string;
  description?: string;
};

export function UserStoryNode({ id, data, selected }: NodeProps<Node<UserStoryData>>) {
  const { setNodes, deleteElements } = useReactFlow();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea logic
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  // Adjust height on initial render and when value changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [data.description, adjustTextareaHeight]);

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
    adjustTextareaHeight();
  }, [id, setNodes, adjustTextareaHeight]);

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  return (
    <div className={`bg-white rounded-lg border-2 shadow-sm transition-all group/node min-w-[208px] h-full flex flex-col ${
      selected ? 'border-cyan ring-2 ring-cyan/20' : 'border-border'
    }`}>
      <NodeResizer 
        isVisible={selected} 
        minWidth={208}
        minHeight={100}
        handleStyle={{ width: 8, height: 8, borderRadius: 4 }}
        lineStyle={{ border: 0 }}
      />
      
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
      <div className="p-2 flex-1 flex flex-col">
        <input
            className="text-sm font-medium text-navy mb-1 w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyan/50 rounded px-1"
            value={data.label}
            onChange={updateLabel}
            placeholder="User Story Title"
        />
        <textarea
            ref={textareaRef}
            className="text-[10px] text-gray-500 w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyan/50 rounded px-1 resize-none overflow-hidden flex-1 min-h-[60px]"
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
