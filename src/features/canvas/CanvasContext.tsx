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
  Connection,
  NodeChange,
  EdgeChange
} from '@xyflow/react';
import { AISettings, DEFAULT_AI_SETTINGS } from '@/lib/ai-config';
import { useSocket } from '@/components/providers/socket-provider';

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
  userName?: string;
  aiSettings: AISettings;
  setAiSettings: (settings: AISettings) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children, initialData, readOnly = false }: { children: ReactNode, initialData?: { nodes: Node[], edges: Edge[] }, readOnly?: boolean }) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState<Node>(initialData?.nodes || []);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState<Edge>(initialData?.edges || []);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [aiSettings, setAiSettings] = useState<AISettings>(DEFAULT_AI_SETTINGS);
  const { socket } = useSocket();

  // Socket: Broadcast changes
  const onNodesChange: OnNodesChange = useCallback((changes) => {
    onNodesChangeInternal(changes);
    if (socket && projectId && !readOnly) {
      socket.emit('node-change', { projectId, changes });
    }
  }, [onNodesChangeInternal, socket, projectId, readOnly]);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    onEdgesChangeInternal(changes);
    if (socket && projectId && !readOnly) {
      socket.emit('edge-change', { projectId, changes });
    }
  }, [onEdgesChangeInternal, socket, projectId, readOnly]);

  const addNode = useCallback((node: Node) => {
    setNodes((nds) => [...nds, node]);
    if (socket && projectId && !readOnly) {
      socket.emit('node-add', { projectId, node });
    }
  }, [setNodes, socket, projectId, readOnly]);

  const onConnect = useCallback((params: Connection) => {
    const edge = { ...params, type: 'deletable', animated: true, style: { stroke: 'var(--cyan)' } };
    setEdges((eds) => addEdge(edge, eds));
    if (socket && projectId && !readOnly) {
      socket.emit('edge-add', { projectId, connection: params }); // Emit params or the full edge? 
      // If we emit params, the other side needs to know how to style it.
      // Better to emit the full edge object if possible, but addEdge handles creation.
      // Let's emit params and let the receiver apply the same style? 
      // Or better: ensure consistency.
      // If I emit params, the receiver's `handleEdgeAdd` calls `addEdge(data.connection, eds)`.
      // It doesn't apply the style!
      // So I should emit the FULL edge configuration or update handleEdgeAdd to apply style.
      // Let's update handleEdgeAdd to apply style too.
    }
  }, [setEdges, socket, projectId, readOnly]);

  // Socket: Listen for changes
  useEffect(() => {
    if (!socket || !projectId || readOnly) return;

    const handleNodeChange = (data: { changes: NodeChange[] }) => {
      onNodesChangeInternal(data.changes);
    };

    const handleEdgeChange = (data: { changes: EdgeChange[] }) => {
      onEdgesChangeInternal(data.changes);
    };

    const handleNodeAdd = (data: { node: Node }) => {
      setNodes((nds) => {
        // Avoid duplicates if possible, though ID should be unique
        if (nds.some(n => n.id === data.node.id)) return nds;
        return [...nds, data.node];
      });
    };

    const handleEdgeAdd = (data: { connection: Connection }) => {
      const edge = { ...data.connection, type: 'deletable', animated: true, style: { stroke: 'var(--cyan)' } };
      setEdges((eds) => addEdge(edge, eds));
    };

    socket.on('node-change', handleNodeChange);
    socket.on('edge-change', handleEdgeChange);
    socket.on('node-add', handleNodeAdd);
    socket.on('edge-add', handleEdgeAdd);

    return () => {
      socket.off('node-change', handleNodeChange);
      socket.off('edge-change', handleEdgeChange);
      socket.off('node-add', handleNodeAdd);
      socket.off('edge-add', handleEdgeAdd);
    };
  }, [socket, projectId, readOnly, onNodesChangeInternal, onEdgesChangeInternal, setNodes, setEdges]);

    if (readOnly) return;
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user?.name) {
            const capitalized = data.user.name.charAt(0).toUpperCase() + data.user.name.slice(1);
            setUserName(capitalized);
        }
      })
      .catch(err => console.error('Failed to fetch user', err));
  }, []);

  // Load canvas
  useEffect(() => {
    if (!projectId || readOnly) return;

    const loadCanvas = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/canvas`);
        if (res.ok) {
          const data = await res.json();
          if (data.content && data.content.nodes) {
            setNodes(data.content.nodes);
            // Ensure all loaded edges are deletable
            const loadedEdges = (data.content.edges || []).map((edge: Edge) => ({
              ...edge,
              type: 'deletable',
            }));
            setEdges(loadedEdges);
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
    if (!projectId || readOnly) return;
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

  return (
    <CanvasContext.Provider value={{
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
      userName,
      aiSettings,
      setAiSettings
    }}>
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
