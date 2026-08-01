import { useLanguage } from '@/contexts/LanguageContext';
import type { Lang } from '@/i18n/translations';
import { Bus, Globe, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function LanguageSelection() {
  const { selectLanguage, t } = useLanguage();
  const [hovered, setHovered] = useState<Lang | null>(null);

  const options: { code: Lang; flag: string; label: string; nativeLabel: string }[] = [
    { code: 'en', flag: '🇬🇧', label: t.langSelect.english, nativeLabel: 'English' },
    { code: 'te', flag: '🇮🇳', label: t.langSelect.telugu, nativeLabel: 'తెలుగు' },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <Bus className="h-8 w-8" />
          </span>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            {t.langSelect.title}
          </h1>
          <p className="mt-2 text-slate-600">{t.langSelect.subtitle}</p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => selectLanguage(opt.code)}
              onMouseEnter={() => setHovered(opt.code)}
              onMouseLeave={() => setHovered(null)}
              className={`group flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-5 text-left transition-all ${
                hovered === opt.code
                  ? 'border-primary shadow-md'
                  : 'border-slate-200'
              }`}
            >
              <span className="text-4xl">{opt.flag}</span>
              <div className="flex-1">
                <p className="text-lg font-bold text-ink">{opt.nativeLabel}</p>
                <p className="text-sm text-slate-500">{opt.label}</p>
              </div>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  hovered === opt.code
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {hovered === opt.code ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
          <Globe className="h-3.5 w-3.5" />
          {t.langSelect.note}
        </p>
      </div>
    </div>
  );
}
