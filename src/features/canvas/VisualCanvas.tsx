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
import { Plus, Save, Smartphone, Moon, Sun } from 'lucide-react';
import { useCanvas } from './CanvasContext';
import { useEffect } from 'react';
import { useTheme } from '@/components/layout/ThemeProvider';

const nodeTypes: NodeTypes = {
  userStory: UserStoryNode,
  screen: ScreenNode,
};

const edgeTypes: EdgeTypes = {
  deletable: DeletableEdge,
};

interface VisualCanvasProps {
  projectId: string;
}

export function VisualCanvas({ projectId }: VisualCanvasProps) {
  const { theme, toggleTheme } = useTheme();
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode, 
    setProjectId, 
    saveCanvas, 
    isSaving 
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
        data: { label: `New ${type}`, description: 'Edit this description...' }
    };
    addNode(newNode);
  };

  return (
    <div className="w-full h-full bg-cloud dark:bg-navy relative transition-colors duration-300">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
         <button 
           onClick={toggleTheme}
           className="bg-white dark:bg-navy border border-border dark:border-gray-700 p-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-navy dark:text-white transition-colors"
           title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
         >
           {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
         </button>
         <button 
           onClick={saveCanvas} 
           disabled={isSaving}
           className="bg-white dark:bg-navy border border-border dark:border-gray-700 p-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-navy dark:text-white disabled:opacity-50 transition-colors"
           title="Save Canvas"
         >
           <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
         </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'deletable' }}
        fitView
        className="bg-cloud dark:bg-navy transition-colors duration-300"
      >
        <Background 
            color={theme === 'dark' ? '#1e3a5f' : '#cbd5e1'} 
            gap={16} 
            size={1} 
        />
        <Controls className="bg-white dark:bg-navy border-border dark:border-gray-700 shadow-sm [&>button]:text-navy [&>button]:dark:text-white [&>button]:dark:bg-navy [&>button]:dark:hover:bg-gray-800" />
        
        {/* Top Toolbar Panel */}
        <Panel position="top-center" className="bg-white dark:bg-navy border border-border dark:border-gray-700 p-2 rounded-full shadow-lg flex gap-2 mt-4 transition-colors duration-300">
            <button onClick={() => onAddNode('userStory')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-navy dark:text-white transition-colors" title="Add User Story">
                <Plus className="w-4 h-4" />
            </button>
            <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <button onClick={() => onAddNode('screen')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-navy dark:text-white transition-colors" title="Add Screen">
                <Smartphone className="w-4 h-4" />
            </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
