import { Handle, Position, NodeProps } from '@xyflow/react';
import { User, FileText } from 'lucide-react';

export function UserStoryNode({ data, selected }: NodeProps) {
  return (
    <div className={`w-64 bg-white rounded-lg border-2 shadow-sm transition-all ${
      selected ? 'border-cyan ring-2 ring-cyan/20' : 'border-border'
    }`}>
      {/* Header */}
      <div className="bg-cloud p-3 rounded-t-md border-b border-border flex items-center gap-2">
        <div className="bg-amber/10 p-1 rounded">
          <User className="w-4 h-4 text-amber" />
        </div>
        <span className="font-bold text-sm text-navy">User Story</span>
      </div>
      
      {/* Content */}
      <div className="p-3">
        <div className="text-sm font-medium text-navy mb-2">{data.label}</div>
        <p className="text-xs text-gray-500 line-clamp-3">
          {data.description || "As a user, I want to..."}
        </p>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-navy border-2 border-white" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-cyan border-2 border-white" />
    </div>
  );
}
