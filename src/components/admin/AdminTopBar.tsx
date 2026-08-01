import { Search, Bell, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { LanguageSwitcherDark } from './LanguageSwitcherDark';

export function AdminTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useLanguage();
  const { page } = useAdmin();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const titleMap: Record<string, string> = {
    dashboard: t.admin.sidebar.dashboard,
    priorityRoutes: t.admin.sidebar.priorityRoutes,
    crowdAnalytics: t.admin.sidebar.crowdAnalytics,
    aiRecommendations: t.admin.sidebar.aiRecommendations,
    reports: t.admin.sidebar.reports,
    settings: t.admin.sidebar.settings,
  };

  const notifications = [
    { text: t.admin.notifications.n1, time: `5 ${t.admin.notifications.minsAgo}` },
    { text: t.admin.notifications.n2, time: `2 ${t.admin.notifications.hoursAgo}` },
    { text: t.admin.notifications.n3, time: `1 ${t.admin.notifications.hoursAgo}` },
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800/50 bg-admin-bg px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">{titleMap[page] || t.admin.brand}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t.admin.topbar.searchPlaceholder}
            className="w-56 rounded-lg border border-slate-700 bg-white/5 py-2 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <LanguageSwitcherDark />

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label={t.admin.topbar.notifications}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-700 bg-admin-card shadow-xl">
              <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold text-white">
                {t.admin.topbar.notifications}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="border-b border-slate-800/50 px-4 py-3 transition hover:bg-slate-800/50 last:border-0"
                  >
                    <p className="text-sm text-slate-300">{n.text}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-slate-500">admin@crowdsense.in</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
