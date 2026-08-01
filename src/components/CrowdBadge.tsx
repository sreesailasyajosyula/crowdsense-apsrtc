import type { CrowdLevel } from '@/data/placeholderData';
import type { Lang } from '@/i18n/translations';
import { translations } from '@/i18n/translations';

const styles: Record<CrowdLevel, string> = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-orange-100 text-orange-700 border-orange-200',
  high: 'bg-red-100 text-red-700 border-red-200',
  'very-high': 'bg-red-200 text-red-900 border-red-300',
};

const dot: Record<CrowdLevel, string> = {
  low: 'bg-green-500',
  medium: 'bg-orange-500',
  high: 'bg-red-500',
  'very-high': 'bg-red-700',
};

export function CrowdBadge({
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
