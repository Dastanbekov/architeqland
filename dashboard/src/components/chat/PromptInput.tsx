import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptInput({ onGenerate, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#12121a] relative">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto text-center mt-20">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">What do you want to build?</h2>
          <p className="text-white/50 text-lg">
            Describe your application in detail. Architeq will generate the structure, deploy the Django backend, and provide a live preview.
          </p>
        </div>
      </div>

      <div className="p-6 border-t border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Build a CRM dashboard with a Kanban board for sales leads..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-16 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none min-h-[60px]"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="absolute right-3 top-3 p-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
