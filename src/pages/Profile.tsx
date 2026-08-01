import { User, Phone, CalendarDays, ScrollText, TrendingUp, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { myJourneys } from '@/data/placeholderData';

export function Profile() {
  const { t, lang } = useLanguage();
  const { isLoggedIn, userName, logout } = useNavigation();

  if (!isLoggedIn) {
    return null;
  }

  const stats = [
    {
      icon: TrendingUp,
      label: t.profile.totalJourneys,
      value: String(myJourneys.length),
    },
    {
      icon: ScrollText,
      label: t.profile.contributions,
      value: String(myJourneys.length),
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-ink">{t.profile.title}</h1>
      <p className="mt-1.5 text-sm text-slate-600">{t.profile.account}</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <User className="h-8 w-8" />
          </span>
          <div>
            <p className="text-xl font-bold text-ink">{userName}</p>
            <p className="text-sm text-slate-500">{t.profile.memberSince}</p>
            <p className="text-sm font-medium text-slate-700">
              {lang === 'te' ? 'జూలై 2024' : 'July 2024'}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-xl bg-card p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-slate-400">{t.profile.mobile}</p>
              <p className="text-sm font-semibold text-ink">+91 98765 4XXXX</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-card p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-slate-400">{t.profile.memberSince}</p>
              <p className="text-sm font-semibold text-ink">
                {lang === 'te' ? 'జూలై 2024' : 'July 2024'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-card p-5"
            >
              <div className="flex items-center gap-2 text-slate-500">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-ink">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={logout}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
      >
        <LogOut className="h-4 w-4" />
        {t.nav.logout}
      </button>
    </div>
  );
}
