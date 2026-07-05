import React from 'react';
import { LayoutDashboard, Settings, History, PlusSquare } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#0a0a0f] border-r border-white/10 h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-500 rounded-md" />
          Architeq
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg transition-colors">
          <PlusSquare className="w-5 h-5" />
          <span className="font-medium text-sm">New Project</span>
        </button>
        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
            Workspace
          </p>
        </div>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium text-sm">Dashboard</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
          <History className="w-5 h-5" />
          <span className="font-medium text-sm">Deployments</span>
        </a>
      </nav>

      <div className="p-4 border-t border-white/10">
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </a>
      </div>
    </aside>
  );
}
