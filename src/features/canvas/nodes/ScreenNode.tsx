import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Smartphone } from 'lucide-react';

type ScreenNodeData = {
  label: string;
};

export function ScreenNode({ data, selected }: NodeProps<Node<ScreenNodeData>>) {
  return (
    <div className={`w-56 bg-white rounded-xl border-2 shadow-md transition-all ${
      selected ? 'border-cyan ring-4 ring-cyan/10' : 'border-gray-200'
    }`}>
      {/* Phone Header */}
      <div className="h-6 bg-navy rounded-t-lg flex items-center justify-center relative">
        <div className="w-12 h-3 bg-black rounded-b-lg"></div>
      </div>
      
      {/* Screen Content */}
      <div className="h-64 bg-gray-50 p-3 relative overflow-hidden group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300 group-hover:text-gray-400 transition-colors">
            <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <span className="text-[10px] font-medium uppercase tracking-widest">{data.label}</span>
        </div>
        
        {/* Placeholder UI Elements */}
        <div className="space-y-2 opacity-30">
            <div className="h-6 bg-gray-300 rounded w-full"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-navy" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-navy" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-cyan" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-cyan" />
    </div>
  );
}
