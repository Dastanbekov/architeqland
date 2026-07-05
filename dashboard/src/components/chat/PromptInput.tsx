import React, { useState } from 'react';
import { Sparkles, ArrowUp } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const MOCK_APPS = [
  { title: 'B2B Distributor Landing Page', desc: 'Lets create landing page for B2B distributors project that we have, I have shared more info in the presentation. like this happy robot style...', views: 39, date: 'updated 10 days ago' },
  { title: 'AI GTM', desc: 'Arashan - Natural Products from Central Asia. Coming from Kyrgyzstan, a unique country in Central Asia, we wanted to continue the family...', views: 916, date: 'updated about 1 month ago' },
  { title: 'NEW Premium Truck Detailing', desc: '', views: 201, date: 'updated about 1 month ago' },
  { title: 'Premium Truck Detailing Platform', desc: 'My goal is to build an to end-to-end AI-native software for truck detailing', views: 0, date: 'just now' },
  { title: 'Premium Printing CRM', desc: 'Build a CRM application', views: 0, date: 'just now' }
];

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
            {MOCK_APPS.map((app, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5 hover:border-white/20 transition-colors cursor-pointer flex flex-col justify-between h-[180px]">
                <div>
                  <h3 className="text-white font-medium mb-3 line-clamp-1">{app.title}</h3>
                  <p className="text-[13px] leading-relaxed text-white/50 line-clamp-3">{app.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {app.views}
                  </div>
                  <span className="text-[11px] text-white/40">{app.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
