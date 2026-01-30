'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback, 
  ReactNode 
} from 'react';
import { 
  Node, 
  Edge, 
  OnNodesChange, 
  OnEdgesChange, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Connection 
} from '@xyflow/react';

interface CanvasContextType {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (params: Connection) => void;
  addNode: (node: Node) => void;
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void;
  projectId: string | null;
  setProjectId: (id: string) => void;
  saveCanvas: () => Promise<void>;
  isSaving: boolean;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load canvas
  useEffect(() => {
    if (!projectId) return;

    const loadCanvas = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/canvas`);
        if (res.ok) {
          const data = await res.json();
          if (data.content && data.content.nodes) {
            setNodes(data.content.nodes);
            setEdges(data.content.edges || []);
          }
        }
      } catch (error) {
        console.error('Failed to load canvas:', error);
      }
    };
    loadCanvas();
  }, [projectId, setNodes, setEdges]);

  // Save canvas
  const saveCanvas = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      await fetch(`/api/projects/${projectId}/canvas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
    } catch (error) {
      console.error('Failed to save canvas:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#2EE6D6' } }, eds)),
    [setEdges]
  );

  const addNode = useCallback((node: Node) => {
    setNodes((nds) => [...nds, node]);
  }, [setNodes]);

  return (
    <CanvasContext.Provider
      value={{
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        setNodes,
        setEdges,
        projectId,
        setProjectId,
        saveCanvas,
        isSaving,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}
