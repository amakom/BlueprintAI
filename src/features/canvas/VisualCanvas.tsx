'use client';

import { 
  ReactFlow, 
  Controls, 
  Background, 
  Panel,
  NodeTypes,
  EdgeTypes,
  Node,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { UserStoryNode } from './nodes/UserStoryNode';
import { ScreenNode } from './nodes/ScreenNode';
import { CommentNode } from './nodes/CommentNode';
import { DeletableEdge } from './edges/DeletableEdge';
import { Plus, Save, Smartphone, Sparkles, MessageSquare, History, Play, MousePointer, X, Layout, Monitor } from 'lucide-react';
import { PropertiesPanel } from './PropertiesPanel';
import { useCanvas } from './CanvasContext';
import { useEffect, useState, useCallback } from 'react';
import { ExportMenu } from './ExportMenu';
import { CollaborativeCursors } from '@/components/canvas/CollaborativeCursors';
import { CommentInput } from './CommentsOverlay';
import { VersionHistory } from './VersionHistory';
import { useSocket } from '@/components/providers/socket-provider';

const nodeTypes: NodeTypes = {
  userStory: UserStoryNode,
  screen: ScreenNode,
  comment: CommentNode,
};

const edgeTypes: EdgeTypes = {
  deletable: DeletableEdge,
};

interface VisualCanvasProps {
  projectId: string;
  readOnly?: boolean;
}

export function VisualCanvas(props: VisualCanvasProps) {
    console.log('VisualCanvas mounting with props:', props);
    return (
        <ReactFlowProvider>
            <VisualCanvasContent {...props} />
        </ReactFlowProvider>
    );
}

function VisualCanvasContent({ projectId, readOnly = false }: VisualCanvasProps) {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode, 
    setNodes,
    setEdges,
    setProjectId, 
    saveCanvas, 
    isSaving,
    userName,
    documentId
  } = useCanvas();

  const { socket } = useSocket();
  const { screenToFlowPosition, flowToScreenPosition, fitView } = useReactFlow();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isCommentMode, setCommentMode] = useState(false);
  const [isPlayMode, setPlayMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Comment Input State
  const [tempCommentPos, setTempCommentPos] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    setProjectId(projectId);
  }, [projectId, setProjectId]);

  // Fetch comments and merge into nodes
  useEffect(() => {
    if (!documentId) return;
    fetch(`/api/comments?documentId=${documentId}`)
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) {
              const commentNodes = data.map((c: any) => ({
                  id: `comment-${c.id}`,
                  type: 'comment',
                  position: { x: c.x, y: c.y },
                  data: { label: c.content, userName: c.user.name, date: new Date(c.createdAt).toLocaleDateString() },
                  draggable: true 
              }));
              setNodes(nds => {
                  const existingIds = new Set(nds.map(n => n.id));
                  const newComments = commentNodes.filter((n: any) => !existingIds.has(n.id));
                  return [...nds, ...newComments];
              });
          }
      });
  }, [documentId, setNodes]);

  // Handle Socket Comment Add
  useEffect(() => {
    if (!socket) return;
    const onCommentAdd = (data: any) => {
        if (data.projectId === projectId) {
            const newNode: Node = {
                id: `comment-${data.id}`,
                type: 'comment',
                position: { x: data.x, y: data.y },
                data: { label: data.content, userName: data.user.name, date: new Date().toLocaleDateString() },
                draggable: true
            };
            setNodes(nds => {
                if (nds.some(n => n.id === newNode.id)) return nds;
                return [...nds, newNode];
            });
        }
    };
    socket.on('comment-add', onCommentAdd);
    return () => { socket.off('comment-add', onCommentAdd); };
  }, [socket, projectId, setNodes]);

  const onAddNode = (type: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNode: Node = {
        id,
        type,
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        data: { 
            label: `New ${type}`, 
            description: 'Edit this description...',
            userName: userName 
        }
    };
    addNode(newNode);
  };

  const handleGenerateFlow = async () => {
    if (readOnly || isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-user-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate flow');
      if (data.nodes && data.edges) {
        setNodes((nds) => [...nds, ...data.nodes]);
        setEdges((eds) => [...eds, ...data.edges]);
      }
    } catch (error) {
      console.error('Error generating flow:', error);
      alert(error instanceof Error ? error.message : "Failed to generate flow");
    } finally {
      setIsGenerating(false);
    }
  };

  // Click handler for Adding Comment
  const onPaneClick = useCallback((event: React.MouseEvent) => {
    if (isCommentMode) {
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        setTempCommentPos(position);
    }
  }, [isCommentMode, screenToFlowPosition]);

  const submitComment = async (text: string) => {
    if (!tempCommentPos || !documentId) return;
    try {
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: text,
                documentId,
                x: tempCommentPos.x,
                y: tempCommentPos.y
            })
        });
        const savedComment = await res.json();
        
        // Add locally
        const newNode: Node = {
            id: `comment-${savedComment.id}`,
            type: 'comment',
            position: { x: savedComment.x, y: savedComment.y },
            data: { label: savedComment.content, userName: savedComment.user.name, date: new Date().toLocaleDateString() },
            draggable: true
        };
        setNodes(prev => [...prev, newNode]);

        // Socket broadcast
        if (socket && projectId) {
            socket.emit('comment-add', { projectId, ...savedComment });
        }

        setTempCommentPos(null);
        setCommentMode(false);
    } catch (err) {
        console.error(err);
    }
  };

  const onDragStart = (event: React.DragEvent, nodeType: string, initialData?: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    if (initialData) {
        event.dataTransfer.setData('application/reactflow/data', JSON.stringify(initialData));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const dataStr = event.dataTransfer.getData('application/reactflow/data');
      const initialData = dataStr ? JSON.parse(dataStr) : {};

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        position,
        data: { 
            ...initialData,
            label: initialData.label || `New ${type}`, 
            description: type === 'userStory' ? 'Edit this description...' : undefined,
            userName: userName 
        },
        style: initialData.style
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode, userName],
  );

  // Play Mode Click Handler
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
      if (isPlayMode && !readOnly) {
          const outgoing = edges.filter(e => e.source === node.id);
          if (outgoing.length > 0) {
              const targetId = outgoing[0].target;
              const targetNode = nodes.find(n => n.id === targetId);
              if (targetNode) {
                  fitView({ nodes: [targetNode], duration: 800, padding: 0.5 });
              }
          }
      }
  }, [isPlayMode, readOnly, edges, nodes, fitView]);

  // Calculate screen position for Input Box
  const inputScreenPos = tempCommentPos ? flowToScreenPosition(tempCommentPos) : null;

  return (
    <div className="w-full h-full bg-cloud relative flex">
        {/* Component Library Sidebar */}
        {!readOnly && !isPlayMode && (
           <div className="w-48 lg:w-56 bg-white border-r border-slate-200 p-4 flex flex-col gap-4 z-10 shadow-sm shrink-0 overflow-y-auto">
              <div className="mb-2">
                 <h3 className="font-bold text-navy text-sm uppercase tracking-wider">Library</h3>
                 <p className="text-xs text-slate-500">Drag to canvas</p>
              </div>
              
              <div className="space-y-3">
                 <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Nodes</h4>
                    <div 
                        className="p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-grab active:cursor-grabbing hover:border-navy hover:shadow-sm transition-all group mb-2"
                        onDragStart={(event) => onDragStart(event, 'userStory')}
                        draggable
                    >
                        <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 bg-navy text-white rounded group-hover:bg-amber transition-colors"><Plus size={12}/></div>
                        <span className="font-bold text-navy text-sm">User Story</span>
                        </div>
                        <p className="text-xs text-slate-500">Define requirements</p>
                    </div>

                    <div 
                        className="p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-grab active:cursor-grabbing hover:border-navy hover:shadow-sm transition-all group"
                        onDragStart={(event) => onDragStart(event, 'screen')}
                        draggable
                    >
                        <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 bg-white border border-slate-200 text-navy rounded group-hover:border-cyan group-hover:text-cyan transition-colors"><Smartphone size={12}/></div>
                        <span className="font-bold text-navy text-sm">Screen</span>
                        </div>
                        <p className="text-xs text-slate-500">Generic Screen</p>
                    </div>
                 </div>

                 <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Frames</h4>
                    <div 
                        className="p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-grab active:cursor-grabbing hover:border-navy hover:shadow-sm transition-all group mb-2"
                        onDragStart={(event) => onDragStart(event, 'screen', { label: 'iPhone 14', style: { width: 390, height: 844 } })}
                        draggable
                    >
                        <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 bg-slate-100 text-slate-600 rounded"><Smartphone size={12}/></div>
                        <span className="font-bold text-navy text-sm">Mobile App</span>
                        </div>
                        <p className="text-xs text-slate-500">390 x 844</p>
                    </div>

                    <div 
                        className="p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-grab active:cursor-grabbing hover:border-navy hover:shadow-sm transition-all group mb-2"
                        onDragStart={(event) => onDragStart(event, 'screen', { label: 'Web Desktop', style: { width: 1440, height: 900 } })}
                        draggable
                    >
                        <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 bg-slate-100 text-slate-600 rounded"><Monitor size={12}/></div>
                        <span className="font-bold text-navy text-sm">Web App</span>
                        </div>
                        <p className="text-xs text-slate-500">1440 x 900</p>
                    </div>

                     <div 
                        className="p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-grab active:cursor-grabbing hover:border-navy hover:shadow-sm transition-all group"
                        onDragStart={(event) => onDragStart(event, 'screen', { label: 'Social Post', style: { width: 1080, height: 1080 } })}
                        draggable
                    >
                        <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 bg-slate-100 text-slate-600 rounded"><Layout size={12}/></div>
                        <span className="font-bold text-navy text-sm">Social Post</span>
                        </div>
                        <p className="text-xs text-slate-500">1080 x 1080</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        <div className="flex-1 relative h-full overflow-hidden">
            <CollaborativeCursors projectId={projectId} />

            {/* Overlays */}
            {inputScreenPos && (
                <CommentInput 
                    x={inputScreenPos.x} 
                    y={inputScreenPos.y} 
                    onSubmit={submitComment} 
                    onCancel={() => setTempCommentPos(null)} 
                />
            )}
            
            {showHistory && <VersionHistory onClose={() => setShowHistory(false)} />}

            {/* Comment Mode Indicator overlay to capture clicks is NOT needed because we use onPaneClick */}
            {isCommentMode && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-xs font-bold shadow-md z-10 border border-amber-200 animate-in slide-in-from-top">
                    Click anywhere to comment
                    <button onClick={() => setCommentMode(false)} className="ml-2 hover:text-amber-950"><X size={12}/></button>
                </div>
            )}

            {/* Empty State Overlay */}
            {nodes.length === 0 && !readOnly && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-white/90 backdrop-blur p-8 rounded-2xl border border-border shadow-xl text-center pointer-events-auto max-w-md">
                <div className="w-16 h-16 bg-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-cyan" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Start Building Your Flow</h3>
                <p className="text-gray-500 mb-8">
                    Drag components from the library or let AI generate a flow for you.
                </p>
                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={handleGenerateFlow}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-white text-navy border border-border rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Generate with AI
                    </button>
                </div>
                </div>
            </div>
            )}

            <div className="absolute top-4 right-4 z-10 flex gap-2">
            {!readOnly && (
                <>
                <button
                    onClick={() => { setPlayMode(!isPlayMode); setCommentMode(false); }}
                    className={`border p-2 rounded-md shadow-sm transition-colors flex items-center gap-2 ${isPlayMode ? 'bg-cyan-50 border-cyan text-cyan-600' : 'bg-white border-border hover:bg-gray-50 text-navy'}`}
                    title={isPlayMode ? "Exit Prototyping Mode" : "Prototyping Mode"}
                >
                    {isPlayMode ? <MousePointer className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                    onClick={() => { setCommentMode(!isCommentMode); setPlayMode(false); }}
                    className={`border p-2 rounded-md shadow-sm transition-colors flex items-center gap-2 ${isCommentMode ? 'bg-amber-50 border-amber-400 text-amber-600' : 'bg-white border-border hover:bg-gray-50 text-navy'}`}
                    title="Comments"
                >
                    <MessageSquare className="w-4 h-4" />
                </button>

                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`border p-2 rounded-md shadow-sm transition-colors flex items-center gap-2 ${showHistory ? 'bg-navy text-white border-navy' : 'bg-white border-border hover:bg-gray-50 text-navy'}`}
                    title="Version History"
                >
                    <History className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <button 
                    onClick={handleGenerateFlow}
                    disabled={isGenerating}
                    className="bg-white border border-border p-2 rounded-md shadow-sm hover:bg-purple-50 text-purple-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                    title="Generate AI User Flow"
                >
                    <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-bold hidden sm:inline">AI Generate</span>
                </button>
                </>
            )}
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
            onConnect={!readOnly && !isPlayMode ? onConnect : undefined}
            onPaneClick={!readOnly ? onPaneClick : undefined}
            onNodeClick={onNodeClick}
            onDrop={!readOnly && !isPlayMode ? onDrop : undefined}
            onDragOver={!readOnly && !isPlayMode ? onDragOver : undefined}
            nodesDraggable={!readOnly && !isPlayMode}
            nodesConnectable={!readOnly && !isPlayMode}
            elementsSelectable={!readOnly && !isPlayMode}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{ type: 'deletable' }}
            fitView
            className={`bg-cloud ${isCommentMode ? 'cursor-crosshair' : ''}`}
            >
            <Background 
                color="#cbd5e1" 
                gap={20} 
            />
            {!readOnly && !isPlayMode && <Controls />}
            </ReactFlow>
        </div>

        {/* Properties Panel (Right Sidebar) */}
        {!readOnly && !isPlayMode && (
            <PropertiesPanel />
        )}
    </div>
  );
}
