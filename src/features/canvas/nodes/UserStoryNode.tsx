import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { User, FileText } from 'lucide-react';

type UserStoryData = {
  label: string;
  description?: string;
};

export function UserStoryNode({ data, selected }: NodeProps<Node<UserStoryData>>) {
  return (
    <div className={`w-52 bg-white rounded-lg border-2 shadow-sm transition-all ${
      selected ? 'border-cyan ring-2 ring-cyan/20' : 'border-border'
    }`}>
      {/* Header */}
      <div className="bg-cloud p-2 rounded-t-md border-b border-border flex items-center gap-2">
        <div className="bg-amber/10 p-1 rounded">
          <User className="w-3 h-3 text-amber" />
        </div>
        <span className="font-bold text-xs text-navy">User Story</span>
      </div>
      
      {/* Content */}
      <div className="p-2">
        <div className="text-sm font-medium text-navy mb-1">{data.label}</div>
        <p className="text-[10px] text-gray-500 line-clamp-3 leading-tight">
          {data.description || "As a user, I want to..."}
        </p>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-navy border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-navy border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-cyan border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-cyan border-2 border-white" />
    </div>
  );
}
