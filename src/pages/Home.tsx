import { Plus, Bus, ScrollText, ArrowRight, LogIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { HeroPreviewCard } from '@/components/HeroPreviewCard';

export function Home() {
  const { t } = useLanguage();
  const { navigate, isLoggedIn } = useNavigation();

  const cards = [
    {
      key: 'addJourney' as const,
      icon: Plus,
      ...t.cards.addJourney,
    },
    {
      key: 'routeInsights' as const,
      icon: Bus,
      ...t.cards.routeInsights,
    },
    {
      key: 'myJourney' as const,
      icon: ScrollText,
      ...t.cards.myJourney,
    },
  ];

  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
              APSRTC
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl">
              {t.hero.heading}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
              {t.hero.subheading}
            </p>
            <button
              onClick={() => navigate('login')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-600 hover:shadow-primary/30"
            >
              {t.hero.loginBtn}
              <LogIn className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-center">
            <HeroPreviewCard />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              const needsLogin = card.key === 'addJourney' || card.key === 'myJourney';
              return (
                <button
                  key={card.key}
                  onClick={() => navigate(needsLogin && !isLoggedIn ? 'login' : card.key)}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                    {card.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {card.action}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
