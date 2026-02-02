import { Handle, Position, NodeProps, Node, useReactFlow, NodeResizer } from '@xyflow/react';
import { User, Trash2, Wand2, History as HistoryIcon, RotateCcw, X } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useCanvas } from '../CanvasContext';
import { AIHistoryItem } from '@/lib/ai-config';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

type UserStoryData = {
  label: string;
  description?: string;
  userName?: string;
  history?: AIHistoryItem[];
};

export function UserStoryNode({ id, data, selected }: NodeProps<Node<UserStoryData>>) {
  const { setNodes, deleteElements } = useReactFlow();
  const { userName, aiSettings, projectId } = useCanvas();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea and node height logic
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Store original styles to restore them later
      const originalHeight = textarea.style.height;
      const originalMinHeight = textarea.style.minHeight;
      const originalFlex = textarea.style.flex;

      // Force shrinkage to measure PURE content height
      // We must disable flex and min-height to get the true scrollHeight of the text
      textarea.style.height = '1px';
      textarea.style.minHeight = '0px';
      textarea.style.flex = 'none'; 

      const scrollHeight = textarea.scrollHeight;

      // Restore styles to let the UI render correctly
      textarea.style.height = originalHeight;
      textarea.style.minHeight = originalMinHeight;
      textarea.style.flex = originalFlex;

      setNodes((nodes) => nodes.map((node) => {
        if (node.id === id) {
          // Calculate total desired height
          // Header (40) + Padding (16) + Input (24) + Buffer (14) = 94px overhead
          // We also respect the textarea's CSS min-height of 60px
          const effectiveContentHeight = Math.max(scrollHeight, 60);
          const minTotalHeight = 94 + effectiveContentHeight; 
          
          // Always update height to fit content, allowing it to shrink or grow
          // This satisfies "adjust automatically to fix fit the text"
          return { ...node, style: { ...node.style, height: minTotalHeight } };
        }
        return node;
      }));
    }
  }, [id, setNodes]);

  // Adjust height on initial render and when value changes
  useEffect(() => {
    adjustHeight();
  }, [data.description, adjustHeight]);

  const updateLabel = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, label: evt.target.value } };
      }
      return node;
    }));
  }, [id, setNodes]);

  const updateDescription = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, description: evt.target.value } };
      }
      return node;
    }));
    adjustHeight();
  }, [id, setNodes, adjustHeight]);

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  const handleRegenerate = useCallback(async () => {
    if (!projectId) {
      alert('Project context missing. Please refresh.');
      return;
    }

    setIsRegenerating(true);
    
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          label: data.label,
          currentDescription: data.description,
          productType: aiSettings.productType,
          tone: aiSettings.tone,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Generation failed');
      }

      const currentDescription = data.description || '';
      const newHistoryItem: AIHistoryItem = {
        id: generateId(),
        timestamp: Date.now(),
        content: currentDescription,
        tone: 'Manual/Previous',
        productType: 'Unknown'
      };

      const newDescription = result.content;

      setNodes((nodes) => nodes.map((node) => {
        if (node.id === id) {
          const history = (node.data.history as AIHistoryItem[]) || [];
          return { 
            ...node, 
            data: { 
              ...node.data, 
              description: newDescription,
              history: [newHistoryItem, ...history].slice(0, 10) // Keep last 10
            } 
          };
        }
        return node;
      }));
      adjustHeight();

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsRegenerating(false);
    }
  }, [id, data.description, data.label, aiSettings, setNodes, adjustHeight, projectId]);

  const handleRestore = useCallback((item: AIHistoryItem) => {
    const currentDescription = data.description || '';
    const newHistoryItem: AIHistoryItem = {
        id: generateId(),
        timestamp: Date.now(),
        content: currentDescription,
        tone: 'Pre-Restore',
        productType: 'Unknown'
    };

    setNodes((nodes) => nodes.map((node) => {
      if (node.id === id) {
        const history = (node.data.history as AIHistoryItem[]) || [];
        return { 
          ...node, 
          data: { 
            ...node.data, 
            description: item.content,
            history: [newHistoryItem, ...history].slice(0, 10)
          } 
        };
      }
      return node;
    }));
    setShowHistory(false);
    adjustHeight();
  }, [id, data.description, setNodes, adjustHeight]);

  const rawName = data.userName || userName;
  const displayName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : undefined;

  return (
    <div className={`bg-white rounded-lg border-2 shadow-sm transition-all group/node min-w-[208px] h-full flex flex-col relative ${
      selected ? 'border-cyan ring-2 ring-cyan/20' : 'border-border'
    }`}>
      <NodeResizer 
        isVisible={selected} 
        minWidth={208}
        minHeight={100}
        handleStyle={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid var(--navy)', backgroundColor: 'white' }}
        lineStyle={{ border: '1px solid var(--cyan)' }}
      />
      
      {/* Header */}
      <div className="bg-cloud p-2 rounded-t-md border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="bg-amber/10 p-1 rounded">
            <User className="w-3 h-3 text-amber" />
            </div>
            <span className="font-bold text-xs text-navy">{displayName ? `${displayName} Story` : 'User Story'}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/node:opacity-100 transition-opacity">
            <button 
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="p-1 hover:bg-white rounded text-cyan transition-colors"
                title={`Regenerate (${aiSettings.tone})`}
            >
                <Wand2 className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`p-1 hover:bg-white rounded text-navy transition-colors ${showHistory ? 'bg-white' : ''}`}
                title="History"
            >
                <HistoryIcon className="w-3 h-3" />
            </button>
            <button 
            onClick={handleDelete}
                className="p-1 hover:bg-white rounded text-red-500 transition-colors"
                title="Delete Node"
            >
                <Trash2 className="w-3 h-3" />
            </button>
        </div>
      </div>

      {/* History Popover */}
      {showHistory && (
        <div className="absolute top-10 right-2 z-50 w-64 bg-white border border-border shadow-xl rounded-md flex flex-col max-h-[200px] overflow-hidden animate-in zoom-in-95 duration-100">
            <div className="p-2 border-b border-border bg-cloud/50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-navy uppercase">Version History</span>
                <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-navy">
                    <X className="w-3 h-3" />
                </button>
            </div>
            <div className="overflow-y-auto flex-1 p-1">
                {!data.history || data.history.length === 0 ? (
                    <div className="p-3 text-center text-xs text-gray-400 italic">No history yet</div>
                ) : (
                    data.history.map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => handleRestore(item)}
                            className="w-full text-left p-2 hover:bg-cloud rounded group/item border-b border-border/50 last:border-0"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                <RotateCcw className="w-3 h-3 text-cyan opacity-0 group-hover/item:opacity-100" />
                            </div>
                            <p className="text-xs text-navy line-clamp-2">{item.content}</p>
                        </button>
                    ))
                )}
            </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-2 flex-1 flex flex-col">
        <input
            className="nodrag text-sm font-medium text-navy mb-1 w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyan/50 rounded px-1 transition-colors"
            value={data.label}
            onChange={updateLabel}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="User Story Title"
        />
        <textarea
            ref={textareaRef}
            className="nodrag text-[10px] text-gray-500 w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyan/50 rounded px-1 resize-none overflow-hidden flex-1 min-h-[60px] transition-colors"
            value={data.description || ''}
            onChange={updateDescription}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="As a user, I want to..."
            rows={3}
        />
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-navy border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-navy border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-cyan border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-cyan border-2 border-white" />
    </div>
  );
}
