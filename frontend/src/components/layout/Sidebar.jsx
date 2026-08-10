// File: src/components/layout/Sidebar.jsx
import { Home, Activity, History, Sparkles, Settings as SettingsIcon } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'live-monitor', label: 'Live Monitor', icon: Activity },
  { id: 'history', label: 'History', icon: History },
  { id: 'ai-reports', label: 'AI Reports', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export function Sidebar({ open, active, onSelect }) {
  return (
    <aside
      className={`sticky top-16 h-[calc(100vh-4rem)] shrink-0 border-r border-[#E5E7EB] bg-white transition-all duration-200 ${open ? 'w-56' : 'w-[68px]'}`}
    >
      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors
                ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
            >
              <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {open && <span className="truncate">{item.label}</span>}
              {open && isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
