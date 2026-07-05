import { LogOut } from 'lucide-react';
import { apiFetch, setAccessToken } from '../../services/api';

export function Sidebar() {
  const handleLogout = async () => {
    try {
      await apiFetch('/api/apps/auth/logout', { method: 'POST' });
    } finally {
      setAccessToken(null);
      window.location.reload();
    }
  };

  return (
    <aside className="w-64 bg-[#111111] border-r border-white/5 h-screen flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Architeq
        </h1>
        <div className="w-4 h-4 border border-white/20 rounded-sm" />
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
         {/* Navigation removed as per user request */}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center justify-between px-2 py-2 hover:bg-white/5 rounded-lg group cursor-pointer transition-colors" onClick={handleLogout}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-pink-500 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-white/40">admin@architeq</p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </aside>
  );
}
