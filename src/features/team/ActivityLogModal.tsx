'use client';

import { X } from 'lucide-react';
import { ActivityLogList } from './ActivityLogList';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function ActivityLogModal({ isOpen, onClose, projectId }: ActivityLogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border bg-gray-50">
          <h2 className="text-lg font-semibold text-navy">Project Activity</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-0">
          <ActivityLogList projectId={projectId} />
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-border flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Close
            </button>
        </div>
      </div>
    </div>
  );
}
