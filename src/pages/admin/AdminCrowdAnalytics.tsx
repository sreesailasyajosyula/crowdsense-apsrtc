import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminBarChart } from '@/components/admin/AdminBarChart';
import { api } from '@/lib/api';

interface AdminAnalytics {
  crowdByRoute: { label: string; value: number }[];
  peakHourData: { hour: string; passengers: number }[];
  weeklyReportData: { day: string; reports: number }[];
}

export function AdminCrowdAnalytics() {
  const { t } = useLanguage();
  const [data, setData] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    api
      .get<AdminAnalytics>('/api/admin/analytics')
      .then(setData)
      .catch((err) => console.error('Failed to load crowd analytics:', err));
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-white">{t.admin.crowdAnalytics.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{t.admin.crowdAnalytics.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-admin-card p-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-white">{t.admin.crowdAnalytics.byRoute}</h3>
          </div>
          <div className="mt-5">
            <AdminBarChart data={data?.crowdByRoute ?? []} highlightMax />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-admin-card p-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-white">{t.admin.crowdAnalytics.byHour}</h3>
          </div>
          <div className="mt-5">
            <AdminBarChart
              data={(data?.peakHourData ?? []).map((d) => ({ label: d.hour, value: d.passengers }))}
              maxBars={12}
              highlightMax
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-admin-card p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-white">{t.admin.crowdAnalytics.byDay}</h3>
        </div>
        <div className="mt-5">
          <AdminBarChart
            data={(data?.weeklyReportData ?? []).map((d) => ({ label: d.day, value: d.reports }))}
            highlightMax
          />
        </div>
      </div>
    </div>
  );
}
