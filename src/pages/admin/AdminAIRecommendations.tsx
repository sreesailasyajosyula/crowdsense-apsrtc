import { useEffect, useState } from 'react';
import {
  Sparkles,
  Clock,
  Lightbulb,
  Users,
  Gauge,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api, ApiError } from '@/lib/api';

type Status = 'pending' | 'approved' | 'rejected';

interface Recommendation {
  id: string;
  routeNo: string;
  from: string;
  to: string;
  timeSlot: string;
  crowdScore: number;
  confidencePercentage: number;
  passengerCount: number;
  standingCount: number;
  seatedCount: number;
  reason: string;
  suggestedAction: string;
  status: Status;
}

export function AdminAIRecommendations() {
  const { t } = useLanguage();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api
      .get<{ recommendations: Recommendation[] }>('/api/admin/recommendations')
      .then(({ recommendations }) => setRecs(recommendations))
      .catch((err) => console.error('Failed to load recommendations:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const { recommendations } = await api.post<{ recommendations: Recommendation[] }>(
        '/api/admin/recommendations/generate'
      );
      setRecs(recommendations);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not generate recommendations.');
    } finally {
      setGenerating(false);
    }
  };

  const handleStatus = async (id: string, status: Status) => {
    setUpdatingId(id);
    try {
      const { recommendation } = await api.patch<{ recommendation: Recommendation }>(
        `/api/admin/recommendations/${id}`,
        { status }
      );
      setRecs((prev) => prev.map((r) => (r.id === id ? recommendation : r)));
    } catch (err) {
      console.error('Failed to update recommendation status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusStyle = (s: Status) =>
    s === 'approved'
      ? 'bg-green-500/15 text-green-400 border-green-500/30'
      : s === 'rejected'
      ? 'bg-red-500/15 text-red-400 border-red-500/30'
      : 'bg-orange-500/15 text-orange-400 border-orange-500/30';

  const statusLabel = (s: Status) =>
    s === 'approved'
      ? t.admin.aiRecPage.statusApproved
      : s === 'rejected'
      ? t.admin.aiRecPage.statusRejected
      : t.admin.aiRecPage.statusPending;

  const confidenceColor = (c: number) => {
    if (c >= 75) return 'text-green-400';
    if (c >= 50) return 'text-orange-400';
    return 'text-slate-400';
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">{t.admin.aiRecPage.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{t.admin.aiRecPage.subtitle}</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
        >
          {generating ? (
            <RotateCcw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {generating ? t.admin.aiRecPage.generating : t.admin.aiRecPage.generate}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && recs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-admin-card py-16 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-slate-700" />
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
            {t.admin.aiRecPage.noResults}
          </p>
          <p className="mx-auto mt-2 max-w-md text-xs text-slate-600">
            {t.admin.aiRecPage.belowThreshold}
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {recs.map((rec) => (
          <div
            key={rec.id}
            className="rounded-2xl border border-slate-800 bg-admin-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle(rec.status)}`}
              >
                {statusLabel(rec.status)}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-lg font-bold text-white">Route {rec.routeNo}</span>
              <span className="text-sm text-slate-500">
                {rec.from} → {rec.to}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-slate-500">{t.admin.aiRecPage.suggestedAction}</p>
                <p className="mt-1 flex items-start gap-2 text-sm font-medium text-white">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {rec.suggestedAction}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t.admin.aiRecPage.reason}</p>
                <p className="mt-1 text-sm text-slate-300">{rec.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-800/50 pt-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-600" />
                  <div>
                    <p className="text-[10px] text-slate-500">{t.admin.aiRecPage.timeSlot}</p>
                    <p className="text-xs font-semibold text-white">{rec.timeSlot}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-3.5 w-3.5 text-slate-600" />
                  <div>
                    <p className="text-[10px] text-slate-500">{t.admin.aiRecPage.crowdScore}</p>
                    <p className="text-xs font-semibold text-white">{rec.crowdScore}/100</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-slate-600" />
                  <div>
                    <p className="text-[10px] text-slate-500">{t.admin.aiRecPage.passengers}</p>
                    <p className="text-xs font-semibold text-white">{rec.passengerCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-slate-600" />
                  <div>
                    <p className="text-[10px] text-slate-500">{t.admin.aiRecPage.confidence}</p>
                    <p className={`text-xs font-semibold ${confidenceColor(rec.confidencePercentage)}`}>
                      {rec.confidencePercentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {rec.status === 'pending' && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleStatus(rec.id, 'approved')}
                  disabled={updatingId === rec.id}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-500/15 py-2.5 text-xs font-semibold text-green-400 transition hover:bg-green-500/25 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t.admin.aiRecPage.approve}
                </button>
                <button
                  onClick={() => handleStatus(rec.id, 'rejected')}
                  disabled={updatingId === rec.id}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500/15 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/25 disabled:opacity-50"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  {t.admin.aiRecPage.reject}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
