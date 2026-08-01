import { Shield, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { View } from '@/contexts/NavigationContext';

export function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { t } = useLanguage();
  const isPrivacy = kind === 'privacy';
  const title = isPrivacy ? t.privacy.title : t.terms.title;
  const body = isPrivacy ? t.privacy.body : t.terms.body;
  const Icon = isPrivacy ? Shield : FileText;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <h1 className="mt-4 text-3xl font-bold text-ink">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

export function Privacy() {
  return <LegalPage kind="privacy" />;
}

export function Terms() {
  return <LegalPage kind="terms" />;
}

export type { View };
