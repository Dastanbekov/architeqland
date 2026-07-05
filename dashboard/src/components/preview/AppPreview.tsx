import React from 'react';
import { ExternalLink, RefreshCw, Smartphone, Monitor } from 'lucide-react';

interface AppPreviewProps {
  url: string | null;
  isLoading: boolean;
  status: string;
}

export function AppPreview({ url, isLoading, status }: AppPreviewProps) {
  if (isLoading) {
    return (
      <div className="w-1/2 bg-[#0a0a0f] border-l border-white/10 flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-white tracking-tight">Generating Application</h3>
        <p className="text-white/50 mt-2 text-sm">{status || "Analyzing requirements..."}</p>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="w-1/2 bg-[#0a0a0f] border-l border-white/10 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Monitor className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-xl font-semibold text-white tracking-tight">No Preview Available</h3>
        <p className="text-white/50 mt-2 text-sm">
          Enter a prompt on the left to start building your application.
        </p>
      </div>
    );
  }

  return (
    <div className="w-1/2 bg-[#0a0a0f] border-l border-white/10 flex flex-col h-screen">
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#12121a]">
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70">
            <Smartphone className="w-4 h-4" />
          </button>
          <button className="p-1.5 bg-white/10 rounded-md text-white">
            <Monitor className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 mx-4 flex justify-center">
          <div className="bg-white/5 px-4 py-1 rounded-full text-xs text-white/50 font-mono flex items-center gap-2 border border-white/10">
            {url}
          </div>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Open App <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="flex-1 bg-white relative">
        <iframe 
          src={url} 
          className="w-full h-full border-0"
          title="App Preview"
        />
      </div>
    </div>
  );
}
