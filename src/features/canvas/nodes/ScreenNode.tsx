import { Handle, Position, NodeProps, Node, useReactFlow, NodeResizer } from '@xyflow/react';
import { Smartphone, Trash2 } from 'lucide-react';
import { useCallback } from 'react';

type ScreenNodeData = {
  label: string;
};

export function ScreenNode({ id, data, selected }: NodeProps<Node<ScreenNodeData>>) {
  const { setNodes, deleteElements } = useReactFlow();

  const updateLabel = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, label: evt.target.value } };
      }
      return node;
    }));
  }, [id, setNodes]);

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  return (
    <div className={`bg-white rounded-xl border-2 shadow-md transition-all group/node flex flex-col min-w-[224px] min-h-[256px] h-full ${
      selected ? 'border-cyan ring-4 ring-cyan/10' : 'border-gray-200'
    }`}>
      <NodeResizer 
        isVisible={selected} 
        minWidth={224}
        minHeight={256}
        handleStyle={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid var(--navy)', backgroundColor: 'white' }}
        lineStyle={{ border: '1px solid var(--cyan)' }}
      />
      
      {/* Phone Header */}
      <div className="h-6 bg-navy rounded-t-lg flex items-center justify-between px-2 relative shrink-0 transition-colors">
        <div className="w-12 h-3 bg-black rounded-b-lg absolute left-1/2 -translate-x-1/2 top-0"></div>
        <div className="flex-1"></div>
        <button 
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover/node:opacity-100 transition-opacity z-10"
            title="Delete Screen"
        >
            <Trash2 className="w-3 h-3" />
        </button>
      </div>
      
      {/* Screen Content */}
      <div className="flex-1 bg-gray-50 p-3 relative overflow-hidden group flex flex-col transition-colors">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300 group-hover:text-gray-400 transition-colors w-full text-center px-4">
          <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <input
              className="text-[10px] font-medium uppercase tracking-widest bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyan/50 rounded px-1 text-center w-full text-gray-500"
              value={data.label}
              onChange={updateLabel}
              placeholder="SCREEN NAME"
          />
        </div>
        
        {/* Placeholder UI Elements */}
        <div className="space-y-2 opacity-30 pointer-events-none w-full flex-1">
            <div className="h-6 bg-gray-300 rounded w-full transition-colors"></div>
            <div className="h-24 bg-gray-200 rounded w-full transition-colors"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 transition-colors"></div>
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-navy border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-navy border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-cyan border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-cyan border-2 border-white" />
    </div>
  );
}
