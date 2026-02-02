'use client';

import { useState } from 'react';
import { X, Loader2, ArrowRight, ArrowLeft, Layout, Smartphone, Globe, Box, Sparkles } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; type: string; aiPrompt: string }) => Promise<void>;
}

const PROJECT_TYPES = [
  { id: 'web', label: 'Web App', icon: Globe, description: 'SaaS, Dashboard, Landing Page' },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone, description: 'iOS, Android, React Native' },
  { id: 'platform', label: 'Platform', icon: Layout, description: 'Multi-platform system' },
  { id: 'other', label: 'Other', icon: Box, description: 'API, CLI, Library' },
];

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'web',
    aiPrompt: '',
    useAI: false
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        aiPrompt: formData.useAI ? formData.aiPrompt : ''
      });
      // Reset form
      setFormData({ name: '', description: '', type: 'web', aiPrompt: '', useAI: false });
      setStep(1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
      <div>
        <label className="block text-sm font-medium text-navy mb-1">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Mobile App Redesign"
          className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all"
          autoFocus
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy mb-1">
          Description <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Briefly describe what you're building..."
          className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all h-24 resize-none"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
      <label className="block text-sm font-medium text-navy mb-1">
        What are you building?
      </label>
      <div className="grid grid-cols-2 gap-3">
        {PROJECT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.type === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData({ ...formData, type: type.id })}
              className={`p-3 border rounded-md text-left transition-all hover:border-cyan/50 ${
                isSelected 
                  ? 'border-cyan bg-cyan/5 ring-1 ring-cyan' 
                  : 'border-border hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-cyan' : 'text-gray-500'}`} />
              <div className={`font-medium ${isSelected ? 'text-navy' : 'text-gray-700'}`}>
                {type.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">{type.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="bg-gradient-to-br from-indigo-50 to-cyan/10 p-4 rounded-md border border-cyan/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-navy">AI Kickstart</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Want to start with a generated PRD? Describe your vision and we'll create the initial structure for you.
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="useAI"
            checked={formData.useAI}
            onChange={(e) => setFormData({ ...formData, useAI: e.target.checked })}
            className="rounded border-gray-300 text-cyan focus:ring-cyan"
          />
          <label htmlFor="useAI" className="text-sm font-medium text-navy cursor-pointer">
            Yes, generate initial content with AI
          </label>
        </div>

        {formData.useAI && (
          <textarea
            value={formData.aiPrompt}
            onChange={(e) => setFormData({ ...formData, aiPrompt: e.target.value })}
            placeholder="e.g., A fitness tracking app that gamifies workouts with social features..."
            className="w-full p-3 border border-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all h-32 resize-none bg-white"
            autoFocus
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-md shadow-xl border border-border animate-in fade-in zoom-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-navy">Create New Project</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className={`h-1.5 w-8 rounded-md transition-colors ${step >= 1 ? 'bg-cyan' : 'bg-gray-200'}`} />
              <div className={`h-1.5 w-8 rounded-md transition-colors ${step >= 2 ? 'bg-cyan' : 'bg-gray-200'}`} />
              <div className={`h-1.5 w-8 rounded-md transition-colors ${step >= 3 ? 'bg-cyan' : 'bg-gray-200'}`} />
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-navy transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="text-gray-500 hover:text-navy font-medium flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div /> // Spacer
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={step === 1 && !formData.name.trim()}
                  className="px-4 py-2 text-sm font-bold text-white bg-navy hover:bg-navy/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || (formData.useAI && !formData.aiPrompt.trim())}
                  className="px-4 py-2 text-sm font-bold text-navy bg-cyan hover:bg-cyan/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Creating...' : 'Create Project'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
