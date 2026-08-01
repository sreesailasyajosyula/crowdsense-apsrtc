import { Globe, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Lang } from '@/i18n/translations';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LanguageSwitcherDark({ compact = false }: { compact?: boolean }) {
  const { lang, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const options: { code: Lang; label: string }[] = [
    { code: 'en', label: t.langSelect.english },
    { code: 'te', label: t.langSelect.telugu },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:border-slate-600"
        aria-label={t.nav.language}
      >
        <Globe className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">{lang === 'te' ? 'తెలుగు' : 'English'}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-700 bg-admin-card py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => {
                setLanguage(opt.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-slate-800 ${
                lang === opt.code ? 'text-primary font-semibold' : 'text-slate-300'
              }`}
            >
              <span>{opt.label}</span>
              {lang === opt.code && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
