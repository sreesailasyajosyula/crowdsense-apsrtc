import { useState, useEffect, useMemo } from 'react';
import { Search, Bus, Clock, Sunrise, Users, Gauge, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CrowdLevel } from '@/data/placeholderData';
import { CrowdBadge } from '@/components/CrowdBadge';
import { api } from '@/lib/api';

interface RouteInsight {
  routeNo: string;
  from: string;
  to: string;
  journeyCount: number;
  crowdScore: number;
  crowdLevel: CrowdLevel;
  avgWaitingMins: number;
  peakTime: string;
  bestTime: string;
}

export function RouteInsights() {
  const { t, lang } = useLanguage();
  const [allInsights, setAllInsights] = useState<RouteInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    api
      .get<{ insights: RouteInsight[] }>('/api/insights/routes')
      .then(({ insights }) => setAllInsights(insights))
      .catch((err) => console.error('Failed to load route insights:', err))
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!searched) return allInsights;
    const from = fromQuery.trim().toLowerCase();
    const to = toQuery.trim().toLowerCase();
    let filtered = allInsights;
    if (from) filtered = filtered.filter((r) => r.from.toLowerCase().includes(from));
    if (to) filtered = filtered.filter((r) => r.to.toLowerCase().includes(to));
    return filtered;
  }, [allInsights, searched, fromQuery, toQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const clearSearch = () => {
    setFromQuery('');
    setToQuery('');
    setSearched(false);
  };

  const scoreColor = (score: number) => {
    if (score >= 75) return 'text-red-700';
    if (score >= 50) return 'text-red-600';
    if (score >= 25) return 'text-orange-600';
    return 'text-green-600';
  };

  const formatTime = (hhmm: string) => {
    if (!hhmm) return '—';
    const [h, m] = hhmm.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">{t.routeInsights.title}</h1>
        <p className="mt-1.5 text-sm text-slate-600">{t.routeInsights.subtitle}</p>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t.routeInsights.from}
            </label>
            <input
              type="text"
              value={fromQuery}
              onChange={(e) => setFromQuery(e.target.value)}
              placeholder={t.routeInsights.fromPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t.routeInsights.to}
            </label>
            <input
              type="text"
              value={toQuery}
              onChange={(e) => setToQuery(e.target.value)}
              placeholder={t.routeInsights.toPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            <Search className="h-4 w-4" />
            {t.routeInsights.search}
          </button>
          {searched && (
            <button
              type="button"
              onClick={clearSearch}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <p className="text-sm text-slate-500">Loading route insights…</p>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <Search className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            {searched
              ? t.routeInsights.noResults
              : 'No journeys have been reported yet. Be the first to add one!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {results.map((route) => (
            <div
              key={`${route.routeNo}-${route.from}-${route.to}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <Bus className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {t.routeInsights.routeNo}
                    </p>
                    <p className="text-lg font-bold text-ink">{route.routeNo}</p>
                  </div>
                </div>
                <CrowdBadge level={route.crowdLevel} lang={lang} size="sm" />
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-700">{route.from}</span>
                <span className="text-slate-300">→</span>
                <span className="font-medium text-slate-700">{route.to}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-primary">
                    <Gauge className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">{t.routeInsights.crowdScore}</p>
                    <p className={`text-sm font-bold ${scoreColor(route.crowdScore)}`}>
                      {route.crowdScore}/100
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-primary">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">{t.routeInsights.avgWaiting}</p>
                    <p className="text-sm font-bold text-ink">
                      {route.avgWaitingMins} {t.routeInsights.mins}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-primary">
                    <Users className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">{t.routeInsights.peakTime}</p>
                    <p className="text-sm font-bold text-ink">{formatTime(route.peakTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-primary">
                    <Sunrise className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">{t.routeInsights.bestTime}</p>
                    <p className="text-sm font-bold text-ink">{formatTime(route.bestTime)}</p>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Based on {route.journeyCount} passenger report
                {route.journeyCount === 1 ? '' : 's'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
