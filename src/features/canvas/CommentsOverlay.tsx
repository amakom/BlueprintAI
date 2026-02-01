import { useState } from 'react';
import { X, Send } from 'lucide-react';

interface CommentInputProps {
  x: number;
  y: number;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export function CommentInput({ x, y, onSubmit, onCancel }: CommentInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <div 
        className="absolute z-50 p-3 bg-white rounded-lg shadow-xl border border-gray-200 w-64 animate-in fade-in zoom-in-95 duration-200"
        style={{ left: x, top: y }}
        onClick={e => e.stopPropagation()}
    >
        <textarea 
            className="w-full h-24 text-sm p-2 border border-gray-200 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none font-sans"
            placeholder="Write a comment..."
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
            onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                }
                if (e.key === 'Escape') onCancel();
            }}
        />
        <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={16} />
            </button>
            <button 
                onClick={handleSubmit} 
                disabled={!text.trim()}
                className="bg-navy text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-navy/90 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Post <Send size={12} />
            </button>
        </div>
    </div>
  );
}
