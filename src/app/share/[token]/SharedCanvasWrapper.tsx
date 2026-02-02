'use client';

import { CanvasProvider } from '@/features/canvas/CanvasContext';
import { VisualCanvas } from '@/features/canvas/VisualCanvas';
import Link from 'next/link';
import { Node, Edge } from '@xyflow/react';

interface SharedCanvasWrapperProps {
  projectId: string;
  projectName: string;
  initialData: { nodes: Node[], edges: Edge[] };
}

export function SharedCanvasWrapper({ projectId, projectName, initialData }: SharedCanvasWrapperProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-cloud">
      <div className="h-14 border-b border-border bg-white flex items-center px-4 justify-between z-20 relative">
        <div className="flex items-center gap-2">
           <Link href="/" className="font-bold text-xl tracking-tight text-navy">
            Blueprint<span className="text-cyan">AI</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-navy">{projectName}</span>
          <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">Read Only</span>
        </div>
        <div>
            <Link href="/" className="text-sm font-medium text-cyan hover:underline">
                Create your own project
            </Link>
        </div>
      </div>
      <div className="flex-1 relative">
        <CanvasProvider initialData={initialData} readOnly>
          <VisualCanvas projectId={projectId} readOnly />
        </CanvasProvider>
      </div>
    </div>
  );
}
