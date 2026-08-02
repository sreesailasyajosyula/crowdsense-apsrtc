import {
  Bus,
  LayoutDashboard,
  AlertTriangle,
  Sparkles,
  FileText,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin, type AdminPage } from '@/contexts/AdminContext';

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useLanguage();
  const { page, navigate, logout } = useAdmin();
  const [hovered, setHovered] = useState<AdminPage | null>(null);

  const items: { key: AdminPage; label: string; icon: typeof Bus }[] = [
    { key: 'dashboard', label: t.admin.sidebar.dashboard, icon: LayoutDashboard },
    { key: 'priorityRoutes', label: t.admin.sidebar.priorityRoutes, icon: AlertTriangle },
    { key: 'aiRecommendations', label: t.admin.sidebar.aiRecommendations, icon: Sparkles },
    { key: 'reports', label: t.admin.sidebar.reports, icon: FileText },
    { key: 'settings', label: t.admin.sidebar.settings, icon: Settings },
  ];

  const go = (p: AdminPage) => {
    navigate(p);
    onNavigate?.();
  };

  return (
    <aside className="flex h-full w-60 flex-col bg-admin-sidebar border-r border-slate-800/50">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-800/50 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <Bus className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <span className="block text-sm font-bold text-white">CrowdSense</span>
          <span className="block text-[10px] text-slate-500">{t.admin.adminPanel}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = page === item.key;
          return (
            <button
              key={item.key}
              onClick={() => go(item.key)}
              onMouseEnter={() => setHovered(item.key)}
              onMouseLeave={() => setHovered(null)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-primary text-white'
                  : hovered === item.key
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-800/50 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" />
          {t.admin.sidebar.logout}
        </button>
      </div>
    </aside>
  );
}

export function AdminMobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full">
        <div className="relative h-full">
          <button
            onClick={onClose}
            className="absolute -right-12 top-4 rounded-lg bg-slate-800 p-2 text-slate-400"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <AdminSidebar onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
