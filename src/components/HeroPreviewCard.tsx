import { Bus, Clock, ArrowRight, Activity, Sunrise } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigation } from '@/contexts/NavigationContext';

export function HeroPreviewCard() {
  const { t, lang } = useLanguage();
  const { navigate } = useNavigation();
  const p = t.heroPreview;

  const crowdStyles = {
    dot: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    label: p.medium,
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <Bus className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {p.routeNo}
            </p>
            <p className="text-lg font-bold text-ink">216</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
          <Activity className="h-3 w-3" />
          {p.live}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-slate-400">{p.from}</p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {lang === 'te' ? 'గుంటూరు బస్ స్టేషన్' : 'Guntur Bus Station'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">{p.to}</p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {lang === 'te' ? 'విజయవాడ బస్ స్టేషన్' : 'Vijayawada Bus Station'}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            {p.crowdLevel}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${crowdStyles.badge}`}
          >
            <span className={`h-2 w-2 rounded-full ${crowdStyles.dot}`} />
            {crowdStyles.label}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-slate-400">{p.avgWaiting}</p>
              <p className="text-sm font-bold text-ink">
                12 {p.mins}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary">
              <Sunrise className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-slate-400">{p.bestTime}</p>
              <p className="text-sm font-bold text-ink">
                {lang === 'te' ? 'ఉదయం 11:00' : '11:00 AM'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('routeInsights')}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
      >
        {p.viewRoute}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
