import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
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

export function AdminPriorityRoutes() {
  const { t } = useLanguage();
  const { selectRoute, navigate } = useAdmin();
  const [routes, setRoutes] = useState<PriorityRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ priorityRoutes: PriorityRoute[] }>('/api/admin/analytics')
      .then((data) => setRoutes(data.priorityRoutes ?? []))
      .catch((err) => console.error('Failed to load priority routes:', err))
      .finally(() => setLoading(false));
  }, []);

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
        <h2 className="text-xl font-bold text-white">{t.admin.priorityRoutes.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{t.admin.priorityRoutes.subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-admin-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30 text-left text-xs font-medium text-slate-500">
                <th className="px-5 py-3">{t.admin.table.route}</th>
                <th className="px-5 py-3">{t.admin.table.from}</th>
                <th className="px-5 py-3">{t.admin.table.to}</th>
                <th className="px-5 py-3">{t.admin.table.crowdScore}</th>
                <th className="px-5 py-3">{t.admin.table.waitingTime}</th>
                <th className="px-5 py-3">{t.admin.table.status}</th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No journey reports yet.
                  </td>
                </tr>
              )}
              {routes.map((route) => (
                <tr
                  key={route.routeNo}
                  className="border-b border-slate-800/50 last:border-0 transition hover:bg-slate-800/30 cursor-pointer"
                  onClick={() => {
                    selectRoute(route.routeNo);
                    navigate('dashboard');
                  }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`h-4 w-4 ${
                          route.status === 'critical' ? 'text-red-400' : 'text-slate-600'
                        }`}
                      />
                      <span className="font-semibold text-white">{route.routeNo}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{route.from}</td>
                  <td className="px-5 py-4 text-slate-300">{route.to}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${scoreColor(route.crowdScore)}`}>
                        {route.crowdScore}
                      </span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-700">
                        <div
                          className={`h-full rounded-full ${
                            route.crowdScore >= 70
                              ? 'bg-red-500'
                              : route.crowdScore >= 40
                              ? 'bg-orange-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${route.crowdScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {route.waitingTime} {t.admin.table.mins}
                  </td>
                  <td className="px-5 py-4">
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
  );
}
