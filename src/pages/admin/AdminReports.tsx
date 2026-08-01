import { useEffect, useMemo, useState } from 'react';
import { FileText, Trash2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CrowdBadgeDark } from '@/components/admin/CrowdBadgeDark';
import type { CrowdLevel } from '@/data/placeholderData';
import { api } from '@/lib/api';

interface AdminJourneyRow {
  id: string;
  date: string;
  routeNo: string;
  from: string;
  to: string;
  crowd: CrowdLevel;
  waitingTime: number;
  reporterPhone: string | null;
}

export function AdminReports() {
  const { t, lang } = useLanguage();
  const [rows, setRows] = useState<AdminJourneyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [dateFilter, setDateFilter] = useState('');
  const [routeFilter, setRouteFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const loadJourneys = () => {
    setLoading(true);
    api
      .get<{ journeys: AdminJourneyRow[] }>('/api/admin/journeys')
      .then(({ journeys }) => setRows(journeys))
      .catch((err) => console.error('Failed to load admin journeys:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJourneys();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (dateFilter && r.date !== dateFilter) return false;
      if (routeFilter && !r.routeNo.toLowerCase().includes(routeFilter.trim().toLowerCase()))
        return false;
      if (locationFilter) {
        const q = locationFilter.trim().toLowerCase();
        const match = r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [rows, dateFilter, routeFilter, locationFilter]);

  const hasFilters = !!(dateFilter || routeFilter || locationFilter);
  const clearFilters = () => {
    setDateFilter('');
    setRouteFilter('');
    setLocationFilter('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.admin.reports.deleteConfirm)) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/journeys/${id}`);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete journey:', err);
      alert('Could not delete this report. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">{t.admin.reports.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{t.admin.reports.subtitle}</p>
        </div>
        <span className="rounded-lg border border-slate-800 bg-admin-card px-3 py-1.5 text-xs font-medium text-slate-400">
          {t.admin.reports.totalCount}: {filtered.length}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-admin-card p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              {t.admin.reports.filterDate}
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              {t.admin.reports.filterRoute}
            </label>
            <input
              type="text"
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              placeholder="e.g. 216"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              {t.admin.reports.filterLocation}
            </label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="e.g. vijayawada"
              className={inputClass}
            />
          </div>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-blue-400"
          >
            <X className="h-3.5 w-3.5" />
            {t.admin.reports.clearFilters}
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-admin-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30 text-left text-xs font-medium text-slate-500">
                <th className="px-5 py-3">{t.admin.reports.date}</th>
                <th className="px-5 py-3">{t.admin.reports.route}</th>
                <th className="px-5 py-3">{t.admin.reports.from}</th>
                <th className="px-5 py-3">{t.admin.reports.to}</th>
                <th className="px-5 py-3">{t.admin.reports.crowd}</th>
                <th className="px-5 py-3">{t.admin.reports.waiting}</th>
                <th className="px-5 py-3">{t.admin.reports.reporter}</th>
                <th className="px-5 py-3">{t.admin.reports.action}</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    {t.admin.reports.noResults}
                  </td>
                </tr>
              )}
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-800/50 last:border-0 transition hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-600" />
                      <span className="text-slate-300">{formatDate(row.date)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-white">{row.routeNo}</td>
                  <td className="px-5 py-3.5 text-slate-300">{row.from}</td>
                  <td className="px-5 py-3.5 text-slate-300">{row.to}</td>
                  <td className="px-5 py-3.5">
                    <CrowdBadgeDark level={row.crowd} lang={lang} size="sm" />
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    {row.waitingTime} {t.admin.reports.mins}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {row.reporterPhone ?? '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleDelete(row.id)}
                      disabled={deletingId === row.id}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t.admin.reports.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
