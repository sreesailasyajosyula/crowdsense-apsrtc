import { useState, useMemo, useEffect } from 'react';
import {
  ScrollText,
  LogIn,
  Calendar,
  ArrowRight,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigation } from '@/contexts/NavigationContext';
import type { CrowdLevel } from '@/data/placeholderData';
import { CrowdBadge } from '@/components/CrowdBadge';
import { api, ApiError } from '@/lib/api';

interface Journey {
  id: string;
  date: string;
  routeNo: string;
  from: string;
  to: string;
  time: string;
  waitingTime: number;
  standing: boolean;
  crowd: CrowdLevel;
}

export function MyJourney() {
  const { t, lang } = useLanguage();
  const { isLoggedIn, navigate } = useNavigation();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CrowdLevel | 'all'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    api
      .get<{ journeys: Journey[] }>('/api/journeys/mine')
      .then(({ journeys }) => {
        if (!cancelled) setJourneys(journeys);
      })
      .catch((err) => console.error('Failed to load journeys:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/journeys/${id}`);
      setJourneys((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error('Failed to delete journey:', err);
      alert(err instanceof ApiError ? err.message : 'Could not delete journey.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() => {
    let list = [...journeys];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (j) =>
          j.routeNo.toLowerCase().includes(q) ||
          j.from.toLowerCase().includes(q) ||
          j.to.toLowerCase().includes(q)
      );
    }
    if (filter !== 'all') {
      list = list.filter((j) => j.crowd === filter);
    }
    list.sort((a, b) => {
      const cmp = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sort === 'newest' ? cmp : -cmp;
    });
    return list;
  }, [journeys, query, filter, sort]);

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
          <LogIn className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-ink">
          {t.myJourney.loginRequired}
        </h2>
        <button
          onClick={() => navigate('login')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
        >
          {t.nav.passengerLogin}
        </button>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filterOptions: { value: CrowdLevel | 'all'; label: string }[] = [
    { value: 'all', label: t.myJourney.filterAll },
    { value: 'low', label: t.myJourney.filterLow },
    { value: 'medium', label: t.myJourney.filterMedium },
    { value: 'high', label: t.myJourney.filterHigh },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">{t.myJourney.title}</h1>
        <p className="mt-1.5 text-sm text-slate-600">{t.myJourney.subtitle}</p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.myJourney.searchPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary-100"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.myJourney.filter}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filter === opt.value
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.myJourney.sort}
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setSort('newest')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                sort === 'newest'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.myJourney.sortNewest}
            </button>
            <button
              onClick={() => setSort('oldest')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                sort === 'oldest'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.myJourney.sortOldest}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <p className="text-sm text-slate-500">Loading your journeys…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <ScrollText className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            {journeys.length === 0 ? t.myJourney.noRecordsEmpty : t.myJourney.noRecords}
          </p>
          {journeys.length === 0 && (
            <button
              onClick={() => navigate('addJourney')}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              {t.cards.addJourney.action}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((j) => (
            <div
              key={j.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {t.myJourney.route} {j.routeNo}
                    </p>
                    <p className="text-sm font-bold text-ink">{formatDate(j.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CrowdBadge level={j.crowd} lang={lang} size="sm" />
                  <button
                    onClick={() => handleDelete(j.id)}
                    disabled={deletingId === j.id}
                    aria-label="Delete journey"
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-700">{j.from}</span>
                <span className="text-slate-300">→</span>
                <span className="font-medium text-slate-700">{j.to}</span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-400">{t.myJourney.travelTime}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink">{j.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t.myJourney.waitingTime}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink">
                    {j.waitingTime} {t.myJourney.mins}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t.myJourney.standingStatus}</p>
                  <p
                    className={`mt-0.5 text-sm font-bold ${
                      j.standing ? 'text-orange-600' : 'text-green-600'
                    }`}
                  >
                    {j.standing ? t.myJourney.standing : t.myJourney.seated}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
