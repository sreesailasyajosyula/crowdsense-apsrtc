import { useEffect, useState } from 'react';
import { Plus, Bus, ScrollText, ArrowRight, TrendingUp, History } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { api } from '@/lib/api';
import { CrowdBadge } from '@/components/CrowdBadge';
import type { CrowdLevel } from '@/data/placeholderData';

interface JourneySummary {
  id: string;
  date: string;
  routeNo: string;
  from: string;
  to: string;
  time: string;
  crowd: CrowdLevel;
}

interface RouteInsight {
  routeNo: string;
  from: string;
  to: string;
  journeyCount: number;
  crowdLevel: CrowdLevel;
}

interface DashboardStats {
  totalJourneys: number;
  recentJourneys: JourneySummary[];
  routeInsights: RouteInsight[];
}

export function Dashboard() {
  const { t, lang } = useLanguage();
  const { navigate, userName } = useNavigation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<DashboardStats>('/api/journeys/dashboard-stats')
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      key: 'addJourney' as const,
      icon: Plus,
      ...t.cards.addJourney,
    },
    {
      key: 'routeInsights' as const,
      icon: Bus,
      ...t.cards.routeInsights,
    },
    {
      key: 'myJourney' as const,
      icon: ScrollText,
      ...t.cards.myJourney,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          {t.dashboard.welcome}, {userName}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 sm:text-base">
          {t.dashboard.subtitle}
        </p>
      </div>

      {/* Stats overview */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* Total journeys */}
        <div className="rounded-2xl border border-slate-200 bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <History className="h-4 w-4" />
            {t.dashboard.recentJourneys}
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">
            {loading ? '—' : stats?.totalJourneys ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-500">{t.dashboard.totalJourneys}</p>

          <div className="mt-4 space-y-3">
            {!loading && (stats?.recentJourneys.length ?? 0) === 0 && (
              <p className="text-sm text-slate-500">{t.dashboard.noJourneysYet}</p>
            )}
            {stats?.recentJourneys.map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-semibold text-ink">Route {j.routeNo}</span>
                  <span className="text-slate-500"> · {j.from} → {j.to}</span>
                </div>
                <CrowdBadge level={j.crowd} lang={lang} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Frequently traveled routes / crowd insights */}
        <div className="rounded-2xl border border-slate-200 bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <TrendingUp className="h-4 w-4" />
            {t.dashboard.frequentRoutes}
          </div>

          <div className="mt-4 space-y-3">
            {!loading && (stats?.routeInsights.length ?? 0) === 0 && (
              <p className="text-sm text-slate-500">{t.dashboard.noRoutesYet}</p>
            )}
            {stats?.routeInsights.map((r) => (
              <div
                key={r.routeNo + r.from + r.to}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-semibold text-ink">Route {r.routeNo}</span>
                  <span className="text-slate-500">
                    {' '}
                    · {r.journeyCount} {t.dashboard.journeysCount}
                  </span>
                </div>
                <CrowdBadge level={r.crowdLevel} lang={lang} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              onClick={() => navigate(card.key)}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition group-hover:bg-primary group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">
                {card.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                {card.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {card.action}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
