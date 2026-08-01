import { useState } from 'react';
import {
  Bell,
  Shield,
  Database,
  Settings as SettingsIcon,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function AdminSettings() {
  const { t } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({
    on,
    onToggle,
  }: {
    on: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`relative h-6 w-11 rounded-full transition ${
        on ? 'bg-primary' : 'bg-slate-700'
      }`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
          on ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  );

  const sections = [
    {
      icon: SettingsIcon,
      title: t.admin.settings.general,
      desc: t.admin.settings.generalDesc,
      controls: <Toggle on={true} onToggle={() => {}} />,
    },
    {
      icon: Bell,
      title: t.admin.settings.notifications,
      desc: t.admin.settings.notificationsDesc,
      controls: (
        <div className="flex flex-col gap-3">
          <Toggle on={emailNotif} onToggle={() => setEmailNotif((v) => !v)} />
          <Toggle on={pushNotif} onToggle={() => setPushNotif((v) => !v)} />
        </div>
      ),
    },
    {
      icon: Shield,
      title: t.admin.settings.security,
      desc: t.admin.settings.securityDesc,
      controls: <Toggle on={twoFA} onToggle={() => setTwoFA((v) => !v)} />,
    },
    {
      icon: Database,
      title: t.admin.settings.dataPrivacy,
      desc: t.admin.settings.dataPrivacyDesc,
      controls: <Toggle on={true} onToggle={() => {}} />,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-white">{t.admin.settings.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{t.admin.settings.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="rounded-2xl border border-slate-800 bg-admin-card p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{section.desc}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-800/50 pt-4">
                {section.controls}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
        >
          {t.admin.settings.save}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400">
            <Check className="h-4 w-4" />
            {t.admin.settings.saved}
          </span>
        )}
      </div>
    </div>
  );
}
