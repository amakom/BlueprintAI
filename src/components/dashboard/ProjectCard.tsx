'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, Edit2, FileText, Check, X } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  title: string;
  updatedAt: string;
  documentCount: number;
  teamName: string;
  onRename: (id: string, newName: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ProjectCard({ id, title, updatedAt, documentCount, teamName, onRename, onDelete }: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when renaming starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenaming]);

  const handleRenameSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newName.trim() || newName === title) {
      setIsRenaming(false);
      setNewName(title);
      return;
    }

    setIsLoading(true);
    await onRename(id, newName);
    setIsLoading(false);
    setIsRenaming(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setIsLoading(true);
      await onDelete(id);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 24 * 60 * 60 * 1000) {
      if (diff < 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000));
        return `Edited ${minutes}m ago`;
      }
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `Edited ${hours}h ago`;
    }
    return `Edited ${date.toLocaleDateString()}`;
  };

  return (
    <div className="relative group h-full">
        {/* Card Content - Wrapped in Link but handles menu separately */}
        <Link href={`/canvas/${id}`} className="block h-full">
            <div className="bg-white p-5 rounded-xl border border-border hover:border-cyan transition-colors shadow-sm h-full flex flex-col relative">
                <div className="h-32 bg-cloud rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    <span className="text-gray-400 font-medium z-10 flex items-center gap-2">
                        <FileText className="w-8 h-8 opacity-50" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-cloud to-white opacity-50" />
                </div>
                
                <div className="mt-auto pr-8">
                    {isRenaming ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRenameSubmit();
                                    if (e.key === 'Escape') {
                                        setIsRenaming(false);
                                        setNewName(title);
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full text-sm font-bold text-navy border border-cyan rounded px-1 py-0.5 outline-none focus:ring-2 focus:ring-cyan/20"
                            />
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleRenameSubmit(); }}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setIsRenaming(false);
                                    setNewName(title);
                                }}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <h3 className="font-bold text-navy group-hover:text-cyan transition-colors truncate" title={title}>
                            {title}
                        </h3>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">{formatDate(updatedAt)}</p>
                        <span className="text-xs px-2 py-1 bg-cloud text-gray-600 rounded-full">
                            {documentCount} docs
                        </span>
                    </div>
                </div>
            </div>
        </Link>

        {/* Action Menu - Absolute positioned on top of the card */}
        <div className="absolute top-3 right-3 z-10" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                }}
                className="p-1.5 rounded-md text-gray-400 hover:text-navy hover:bg-cloud transition-colors opacity-0 group-hover:opacity-100 data-[open=true]:opacity-100"
                data-open={isMenuOpen}
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-border py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsRenaming(true);
                            setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-navy hover:bg-cloud flex items-center gap-2"
                    >
                        <Edit2 className="w-3 h-3" />
                        Rename
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMenuOpen(false);
                            handleDelete();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <Trash2 className="w-3 h-3" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    </div>
  );
}
