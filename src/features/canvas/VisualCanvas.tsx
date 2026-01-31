'use client';

import { 
  ReactFlow, 
  Controls, 
  Background, 
  Panel,
  NodeTypes,
  EdgeTypes,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { UserStoryNode } from './nodes/UserStoryNode';
import { ScreenNode } from './nodes/ScreenNode';
import { DeletableEdge } from './edges/DeletableEdge';
import { Plus, Save, Smartphone } from 'lucide-react';
import { useCanvas } from './CanvasContext';
import { useEffect } from 'react';
import { ExportMenu } from './ExportMenu';

const nodeTypes: NodeTypes = {
  userStory: UserStoryNode,
  screen: ScreenNode,
};

const edgeTypes: EdgeTypes = {
  deletable: DeletableEdge,
};

interface VisualCanvasProps {
  projectId: string;
  readOnly?: boolean;
}
export function VisualCanvas({ projectId, readOnly = false }: VisualCanvasProps) {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode, 
    setProjectId, 
    saveCanvas, 
    isSaving,
    userName
  } = useCanvas();

  useEffect(() => {
    setProjectId(projectId);
  }, [projectId, setProjectId]);

  const onAddNode = (type: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNode: Node = {
        id,
        type,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { 
            label: `New ${type}`, 
            description: 'Edit this description...',
            userName: userName 
        }
    };
    addNode(newNode);
  };

  return (
    <div className="w-full h-full bg-cloud relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
         {!readOnly && <ExportMenu projectId={projectId} />}
         {!readOnly && (
           <button 
             onClick={saveCanvas} 
             disabled={isSaving}
             className="bg-white border border-border p-2 rounded-md shadow-sm hover:bg-gray-50 text-navy disabled:opacity-50 transition-colors"
             title="Save Canvas"
           >
             <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
           </button>
         )}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={!readOnly ? onNodesChange : undefined}
        onEdgesChange={!readOnly ? onEdgesChange : undefined}
        onConnect={!readOnly ? onConnect : undefined}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'deletable' }}
        fitView
        className="bg-cloud"
      >
        <Background 
            color="#cbd5e1" 
            gap={16} 
            size={1} 
        />
        <Controls className="bg-white border-border shadow-sm [&>button]:text-navy" />
        
        {/* Top Toolbar Panel */}
        {!readOnly && (
        <Panel position="top-center" className="bg-white border border-border p-2 rounded-full shadow-lg flex gap-2 mt-4">
            <button onClick={() => onAddNode('userStory')} className="p-2 hover:bg-gray-100 rounded-full text-navy transition-colors" title="Add User Story">
                <Plus className="w-5 h-5" />
            </button>
            <button onClick={() => onAddNode('screen')} className="p-2 hover:bg-gray-100 rounded-full text-navy transition-colors" title="Add Screen">
                <Smartphone className="w-5 h-5" />
            </button>
        </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
