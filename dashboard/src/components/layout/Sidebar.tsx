import { LogOut } from 'lucide-react';
import { apiFetch, setAccessToken } from '../../services/api';
import { Project } from '../../services/projectsApi';

interface SidebarProps {
  projects?: Project[];
  onProjectSelect?: (project: Project) => void;
}

export function Sidebar({ projects = [], onProjectSelect }: SidebarProps) {
  const handleLogout = async () => {
    try {
      await apiFetch('/api/apps/auth/logout', { method: 'POST' });
    } finally {
      setAccessToken(null);
      window.location.reload();
    }
  };

  return (
    <aside className="w-60 bg-[#111111] border-r border-white/5 h-screen flex flex-col flex-shrink-0">
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/5">
        <h1 className="text-base font-semibold tracking-tight text-white">Architeq</h1>
        <div className="w-4 h-4 border border-white/15 rounded-sm cursor-pointer hover:border-white/30 transition-colors" />
      </div>
      
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {projects.length > 0 && (
          <div className="mb-2">
            <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1">
              Apps
            </p>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => onProjectSelect?.(p)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      p.status === 'live' ? 'bg-emerald-500' :
                      p.status === 'error' ? 'bg-red-500' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-[13px] text-white/70 group-hover:text-white transition-colors truncate">
                    {p.display_name || p.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-white/5">
        <div
          className="flex items-center justify-between px-2 py-2 hover:bg-white/5 rounded-lg group cursor-pointer transition-colors"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white leading-none">Admin</p>
              <p className="text-[11px] text-white/35 mt-0.5">admin@architeq</p>
            </div>
          </div>
          <LogOut className="w-3.5 h-3.5 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
