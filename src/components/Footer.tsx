import { Bus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigation, type View } from '@/contexts/NavigationContext';

export function Footer() {
  const { t } = useLanguage();
  const { navigate } = useNavigation();

  const links: { key: View; label: string }[] = [
    { key: 'about', label: t.footer.about },
    { key: 'contact', label: t.footer.contact },
    { key: 'privacy', label: t.footer.privacy },
    { key: 'terms', label: t.footer.terms },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                <Bus className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold text-ink">CrowdSense</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {t.footer.description}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {links.map((link) => (
              <button
                key={link.key}
                onClick={() => navigate(link.key)}
                className="text-sm font-medium text-slate-600 transition hover:text-primary"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-center text-xs text-slate-500">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
