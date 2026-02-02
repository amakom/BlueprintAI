import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message, 
  title = "Confirm Action",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false
}: ConfirmModalProps) {
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
          <div className="w-12 h-12 rounded-md bg-[#2ee6d6]/10 flex items-center justify-center mb-4">
            <HelpCircle className="w-6 h-6 text-[#2ee6d6]" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          
          <p className="text-slate-300 mb-6 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700 text-white font-bold py-2.5 px-4 rounded-md hover:bg-slate-600 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 font-bold py-2.5 px-4 rounded-md transition-colors ${
                isDanger 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-[#2ee6d6] text-[#0b1f33] hover:bg-[#2ee6d6]/90'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
