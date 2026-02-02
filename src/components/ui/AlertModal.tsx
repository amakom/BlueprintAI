import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

export function AlertModal({ isOpen, onClose, message, title = "Error" }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b1f33] border border-[#2ee6d6]/30 rounded-md shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-md bg-red-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          
          <p className="text-slate-300 mb-6 leading-relaxed">
            {message}
          </p>

          <button
            onClick={onClose}
            className="bg-[#2ee6d6] text-[#0b1f33] font-bold py-2.5 px-6 rounded-md hover:bg-[#2ee6d6]/90 transition-colors w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
