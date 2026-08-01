import { Users, Target, BookOpen, HeartHandshake } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function About() {
  const { t } = useLanguage();

  const steps = [
    { num: '1', text: t.about.how1 },
    { num: '2', text: t.about.how2 },
    { num: '3', text: t.about.how3 },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">{t.about.title}</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        {t.about.intro}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-card p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <Target className="h-5 w-5" />
          </span>
          <h2 className="mt-3 text-lg font-bold text-ink">{t.about.missionTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {t.about.mission}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-card p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <Users className="h-5 w-5" />
          </span>
          <h2 className="mt-3 text-lg font-bold text-ink">{t.about.forEveryoneTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {t.about.forEveryone}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-ink">{t.about.howTitle}</h2>
        </div>
        <ol className="mt-4 space-y-4">
          {steps.map((step) => (
            <li key={step.num} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {step.num}
              </span>
              <p className="pt-0.5 text-sm leading-relaxed text-slate-700">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-6">
        <HeartHandshake className="h-6 w-6 shrink-0 text-primary" />
        <p className="text-sm font-medium text-primary-700">{t.tagline}</p>
      </div>
    </div>
  );
}
