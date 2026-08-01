import { useEffect, useState } from 'react';
import {
  FileText,
  Gauge,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { AdminBarChart } from '@/components/admin/AdminBarChart';
import { api } from '@/lib/api';

type RouteStatus = 'critical' | 'moderate' | 'normal';

interface PriorityRoute {
  routeNo: string;
  from: string;
  to: string;
  crowdScore: number;
  waitingTime: number;
  status: RouteStatus;
  peakTime: string;
  journeyReports: number;
}

interface AdminAnalytics {
  totalReports: number;
  avgCrowdScore: number;
  avgWaitingTime: number;
  highPriorityCount: number;
  crowdByRoute: { label: string; value: number }[];
  peakHourData: { hour: string; passengers: number }[];
  weeklyReportData: { day: string; reports: number }[];
  priorityRoutes: PriorityRoute[];
}

export function AdminDashboardPage() {
  const { t } = useLanguage();
  const { selectedRouteId, selectRoute, navigate } = useAdmin();
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<AdminAnalytics>('/api/admin/analytics')
      .then(setData)
      .catch((err) => console.error('Failed to load admin analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  const priorityRoutes = data?.priorityRoutes ?? [];
  const selectedRoute =
    priorityRoutes.find((r) => r.routeNo === selectedRouteId) || priorityRoutes[0];

  const stats = [
    {
      label: t.admin.stats.totalReports,
      value: loading ? '—' : String(data?.totalReports ?? 0),
      unit: '',
      icon: FileText,
    },
    {
      label: t.admin.stats.avgCrowdScore,
      value: loading ? '—' : String(data?.avgCrowdScore ?? 0),
      unit: '/100',
      icon: Gauge,
    },
    {
      label: t.admin.stats.avgWaitingTime,
      value: loading ? '—' : String(data?.avgWaitingTime ?? 0),
      unit: t.admin.stats.mins,
      icon: Clock,
    },
    {
      label: t.admin.stats.highPriority,
      value: loading ? '—' : String(data?.highPriorityCount ?? 0),
      unit: t.admin.stats.routes,
      icon: AlertTriangle,
    },
  ];

  const statusLabel = (s: RouteStatus) =>
    s === 'critical' ? t.admin.table.critical : s === 'moderate' ? t.admin.table.moderate : t.admin.table.normal;

  const statusStyle = (s: RouteStatus) =>
    s === 'critical'
      ? 'bg-red-500/15 text-red-400 border-red-500/30'
      : s === 'moderate'
      ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
      : 'bg-green-500/15 text-green-400 border-green-500/30';

  const scoreColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-white">{t.admin.dashboard.title}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-admin-card p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-2xl font-bold text-white">
                {stat.value}
                <span className="ml-1 text-sm font-normal text-slate-500">{stat.unit}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-admin-card p-5">
            <h3 className="text-sm font-semibold text-white">{t.admin.dashboard.crowdByRouteTitle}</h3>
            <div className="mt-5">
              <AdminBarChart data={data?.crowdByRoute ?? []} highlightMax />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-admin-card p-5">
              <h3 className="text-sm font-semibold text-white">{t.admin.dashboard.peakHourTitle}</h3>
              <div className="mt-5">
                <AdminBarChart
                  data={(data?.peakHourData ?? []).map((d) => ({ label: d.hour, value: d.passengers }))}
                  maxBars={8}
                  highlightMax
                />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-admin-card p-5">
              <h3 className="text-sm font-semibold text-white">{t.admin.dashboard.weeklyReportsTitle}</h3>
              <div className="mt-5">
                <AdminBarChart
                  data={(data?.weeklyReportData ?? []).map((d) => ({ label: d.day, value: d.reports }))}
                  highlightMax
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-admin-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {t.admin.dashboard.priorityRoutesTitle}
              </h3>
              <button
                onClick={() => navigate('priorityRoutes')}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary transition hover:text-blue-400"
              >
                {t.admin.priorityRoutes.title}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs font-medium text-slate-500">
                    <th className="pb-3 pr-4">{t.admin.table.route}</th>
                    <th className="pb-3 pr-4">{t.admin.table.crowdScore}</th>
                    <th className="pb-3 pr-4">{t.admin.table.waitingTime}</th>
                    <th className="pb-3">{t.admin.table.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityRoutes.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500">
                        No journey reports yet.
                      </td>
                    </tr>
                  )}
                  {priorityRoutes.slice(0, 5).map((route) => (
                    <tr
                      key={route.routeNo}
                      className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 cursor-pointer"
                      onClick={() => selectRoute(route.routeNo)}
                    >
                      <td className="py-3 pr-4">
                        <span className="font-semibold text-white">{route.routeNo}</span>
                        <span className="block text-xs text-slate-500">
                          {route.from} → {route.to}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`font-bold ${scoreColor(route.crowdScore)}`}>
                          {route.crowdScore}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">
                        {route.waitingTime} {t.admin.table.mins}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle(route.status)}`}
                        >
                          {statusLabel(route.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {selectedRoute && (
            <div className="rounded-2xl border border-slate-800 bg-admin-card p-5">
              <h3 className="text-sm font-semibold text-white">{t.admin.dashboard.routeDetailsTitle}</h3>
              <p className="mt-1 text-xs text-slate-500">
                {t.admin.dashboard.routeDetailsSubtitle}
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
                  <span className="text-sm text-slate-400">{t.admin.dashboard.crowdScore}</span>
                  <span className={`text-lg font-bold ${scoreColor(selectedRoute.crowdScore)}`}>
                    {selectedRoute.crowdScore}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
                  <span className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="h-4 w-4 text-slate-600" />
                    {t.admin.dashboard.peakTime}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {selectedRoute.peakTime}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
                  <span className="flex items-center gap-2 text-sm text-slate-400">
                    <Gauge className="h-4 w-4 text-slate-600" />
                    {t.admin.dashboard.avgWaiting}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {selectedRoute.waitingTime} {t.admin.dashboard.mins}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-400">
                    <FileText className="h-4 w-4 text-slate-600" />
                    {t.admin.dashboard.journeyReports}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {selectedRoute.journeyReports}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold text-white">{t.admin.ai.title}</h3>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              AI-generated recommendations based on live crowd data will appear
              here once the recommendation engine is enabled.
            </p>
            <button
              onClick={() => navigate('aiRecommendations')}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/20 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/30"
            >
              {t.admin.ai.generateMore}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
