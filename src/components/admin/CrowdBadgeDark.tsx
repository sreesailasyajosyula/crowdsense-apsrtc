import type { CrowdLevel } from '@/data/placeholderData';
import type { Lang } from '@/i18n/translations';
import { translations } from '@/i18n/translations';

const styles: Record<CrowdLevel, string> = {
  low: 'bg-green-500/15 text-green-400 border-green-500/30',
  medium: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  high: 'bg-red-500/15 text-red-400 border-red-500/30',
  'very-high': 'bg-red-600/20 text-red-300 border-red-600/40',
};

const dot: Record<CrowdLevel, string> = {
  low: 'bg-green-400',
  medium: 'bg-orange-400',
  high: 'bg-red-400',
  'very-high': 'bg-red-600',
};

export function CrowdBadgeDark({
  level,
  lang,
  size = 'md',
}: {
  level: CrowdLevel;
  lang: Lang;
  size?: 'sm' | 'md';
}) {
  const t = translations[lang].routeInsights;
  const labels: Record<CrowdLevel, string> = {
    low: t.low,
    medium: t.medium,
    high: t.high,
    'very-high': t.veryHigh,
  };
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${styles[level]} ${pad}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot[level]}`} />
      {labels[level]}
    </span>
  );
}
