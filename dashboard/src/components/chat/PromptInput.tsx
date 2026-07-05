import React, { useState } from 'react';
import { Sparkles, ArrowUp } from 'lucide-react';
import { Project } from '../../services/projectsApi';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  projects?: Project[];
  onProjectSelect?: (project: Project) => void;
}

export function PromptInput({ onGenerate, isLoading, projects = [], onProjectSelect }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] relative overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto p-8 pt-20">
        <h1 className="text-4xl font-bold text-white text-center mb-10 tracking-tight">Start something new</h1>
        
        <form onSubmit={handleSubmit} className="relative mb-20 max-w-3xl mx-auto">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 focus-within:border-white/20 transition-colors">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What do you want to launch today?"
              className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none resize-none min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex items-center justify-between mt-4">
              <button type="button" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors border border-white/5">
                <Sparkles className="w-4 h-4 text-white/50" />
                Auto
              </button>
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-50 transition-colors text-white border border-white/10"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center border-b border-white/10">
            <h2 className="text-sm font-medium text-white pb-3 border-b-2 border-white">Apps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-white/20 text-sm">
                Ещё нет проектов. Опиши что хочешь создать выше!
              </div>
            ) : projects.map((p) => (
              <div
                key={p.id}
                onClick={() => onProjectSelect?.(p)}
                className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5 hover:border-white/20 transition-colors cursor-pointer flex flex-col justify-between h-[180px]"
              >
                <div>
                  <h3 className="text-white font-medium mb-3 line-clamp-1">{p.display_name || p.name}</h3>
                  <p className="text-[13px] leading-relaxed text-white/50 line-clamp-3">{p.subdomain}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      p.status === 'live' ? 'bg-emerald-500' :
                      p.status === 'error' ? 'bg-red-500' : 'bg-amber-400'
                    }`} />
                    {p.status}
                  </div>
                  <span className="text-[11px] text-white/40">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
