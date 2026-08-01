import { Bus, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigation, type View } from '@/contexts/NavigationContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const { t } = useLanguage();
  const { view, isLoggedIn, userName, navigate, logout } = useNavigation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const publicNav: { key: View; label: string }[] = [
    { key: 'home', label: t.nav.home },
    { key: 'about', label: t.nav.about },
    { key: 'contact', label: t.nav.contact },
  ];

  const dashboardNav: { key: View; label: string }[] = [
    { key: 'dashboard', label: t.nav.dashboard },
    { key: 'profile', label: t.nav.profile },
  ];

  const navItems = isLoggedIn ? dashboardNav : publicNav;

  const go = (v: View) => {
    navigate(v);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => go(isLoggedIn ? 'dashboard' : 'home')}
          className="flex items-center gap-2.5"
          aria-label="CrowdSense home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <Bus className="h-5 w-5" />
          </span>
          <div className="text-left leading-tight">
            <span className="block text-lg font-bold text-ink">CrowdSense</span>
            <span className="hidden text-[11px] text-slate-500 sm:block">
              {t.tagline}
            </span>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => go(item.key)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                view === item.key
                  ? 'bg-primary-50 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-medium text-slate-600">
                {t.common.welcome}, {userName}
              </span>
              <button
                onClick={() => go('profile')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  view === 'profile'
                    ? 'bg-primary-50 text-primary'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                aria-label={t.nav.profile}
              >
                <User className="h-4 w-4" />
                {t.nav.profile}
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <LogOut className="h-4 w-4" />
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <button
              onClick={() => go('login')}
              className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 sm:inline-flex"
            >
              {t.nav.passengerLogin}
            </button>
          )}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => go(item.key)}
                className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  view === item.key
                    ? 'bg-primary-50 text-primary'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isLoggedIn ? (
              <>
                <div className="px-3 py-2 text-sm text-slate-600">
                  {t.common.welcome}, {userName}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg bg-slate-100 px-3 py-2.5 text-left text-sm font-semibold text-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <button
                onClick={() => go('login')}
                className="block w-full rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                {t.nav.passengerLogin}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
