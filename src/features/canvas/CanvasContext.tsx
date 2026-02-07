'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  documentId: string | null;
  saveCanvas: () => Promise<void>;
  isSaving: boolean;
  userName?: string;
  aiSettings: AISettings;
  setAiSettings: (settings: AISettings) => void;
  onError: (message: string) => void;
  error: string | null;
  clearError: () => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children, initialData, readOnly = false }: { children: ReactNode, initialData?: { nodes: Node[], edges: Edge[] }, readOnly?: boolean }) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState<Node>(initialData?.nodes || []);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState<Edge>(initialData?.edges || []);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [aiSettings, setAiSettings] = useState<AISettings>(DEFAULT_AI_SETTINGS);
  const { socket } = useSocket();
  const [error, setError] = useState<string | null>(null);

  // Helper to expose error setter
  const onError = useCallback((message: string) => {
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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

  // Fetch User Name
  useEffect(() => {
    if (readOnly) return;

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user?.name) {
          const capitalized = data.user.name.charAt(0).toUpperCase() + data.user.name.slice(1);
          setUserName(capitalized);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    };

    fetchUser();
  }, []);

  // Load canvas
  useEffect(() => {
    if (!projectId || readOnly) return;

    const loadCanvas = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/canvas`);
        if (res.ok) {
          const data = await res.json();
          if (data.documentId) {
            setDocumentId(data.documentId);
          }
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
  const saveCanvas = useCallback(async () => {
    if (!projectId || readOnly) return;
    setIsSaving(true);
    try {
      // Filter out comment nodes before saving
      const nodesToSave = nodes.filter(n => n.type !== 'comment');

      await fetch(`/api/projects/${projectId}/canvas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: nodesToSave, edges }),
      });
    } catch (error) {
      console.error('Failed to save canvas:', error);
    } finally {
      setIsSaving(false);
    }
  }, [projectId, readOnly, nodes, edges]);

  // Auto-save: debounce 30 seconds after any change
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Don't auto-save until initial load is done
    if (!projectId || readOnly) return;
    if (!hasLoadedRef.current) {
      // Mark as loaded after first render with nodes
      if (nodes.length > 0 || edges.length > 0) {
        hasLoadedRef.current = true;
      }
      return;
    }

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      saveCanvas();
    }, 30000);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [nodes, edges, projectId, readOnly, saveCanvas]);

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
      documentId,
      saveCanvas,
      isSaving,
      userName,
      aiSettings,
      setAiSettings,
      onError,
      error,
      clearError
    }}>
      {children}
      {/* We expose the error state via a getter in the context? No, we need to render the modal. 
          But CanvasProvider is a logic provider. It might not be the best place to render UI.
          However, for global errors, it's convenient. 
          Actually, since VisualCanvasContent is the main UI, let's expose 'error' and 'setError' (as onError/clearError) 
          and let VisualCanvasContent render the modal.
          Wait, I defined onError in the interface but didn't expose 'error' state.
          I should expose 'error' and 'clearError' so consumers can render it.
          Or, I can render it here if I import AlertModal. 
          Let's expose error and clearError.
      */}
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
