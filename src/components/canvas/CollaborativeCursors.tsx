'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/components/providers/socket-provider';
import { useSession } from 'next-auth/react';

type CursorData = {
  userId: string;
  userName: string;
  x: number;
  y: number;
  color: string;
};

const COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F5', 
  '#33FFF5', '#F5FF33', '#FF8C33', '#8C33FF'
];

const getRandomColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

export const CollaborativeCursors = ({ projectId }: { projectId: string }) => {
  const { socket, isConnected } = useSocket();
  const { data: session } = useSession();
  const [cursors, setCursors] = useState<Record<string, CursorData>>({});

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!socket || !isConnected || !session?.user) return;

    // Convert screen coordinates to canvas-relative if possible
    // For now, we use viewport coordinates, but ideally this should be relative to the canvas pane
    // This component should be placed inside the ReactFlow container or handle coordinate transformation
    // But since it's an overlay, let's just use clientX/Y and assume full screen canvas or offset
    
    // Actually, ReactFlow provides useReactFlow hook to project coordinates, but we can't use it easily outside ReactFlow provider
    // If this component is inside ReactFlow, we can use useReactFlow.
    // For now, let's assume it's an overlay and we send raw coordinates, 
    // but the best way is to send "canvas" coordinates.
    // Let's implement this assuming it's mounted inside VisualCanvas which is inside ReactFlowProvider.
    // Wait, VisualCanvas uses <ReactFlow>. We should put this INSIDE <ReactFlow> as a child or standard HTML overlay.
    // If it's a standard HTML overlay on top, we use relative to window.
    
    socket.emit('cursor-move', {
      projectId,
      userId: session.user.id,
      userName: session.user.name || 'Anonymous',
      x: e.clientX,
      y: e.clientY,
      color: getRandomColor(session.user.id),
    });
  }, [socket, isConnected, projectId, session]);

  // Throttle
  useEffect(() => {
    let lastRun = 0;
    const throttleDelay = 50;

    const onMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastRun >= throttleDelay) {
        handleMouseMove(e);
        lastRun = now;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (!socket) return;

    const onCursorMove = (data: CursorData) => {
      if (data.userId === session?.user?.id) return;
      
      setCursors(prev => ({
        ...prev,
        [data.userId]: data
      }));
    };

    socket.on('cursor-move', onCursorMove);

    return () => {
      socket.off('cursor-move', onCursorMove);
    };
  }, [socket, session]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Object.values(cursors).map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute flex items-center gap-2 transition-all duration-100 ease-linear"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-50%, -50%)', // Center cursor? No, usually top-left.
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ fill: cursor.color }}
          >
            <path
              d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19177L11.7841 12.3673H5.65376Z"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          <span 
            className="px-2 py-1 text-xs text-white rounded-full whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.userName}
          </span>
        </div>
      ))}
    </div>
  );
};
