import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Contact() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t.contact.errorName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = t.contact.errorEmail;
    if (!message.trim()) next.message = t.contact.errorMessage;
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSuccess(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  const inputClass = (err?: string) =>
    `w-full rounded-xl border bg-white py-3 px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:ring-2 ${
      err
        ? 'border-red-300 focus:ring-red-200'
        : 'border-slate-200 focus:border-primary focus:ring-primary-100'
    }`;

  const contactInfo = [
    { icon: Phone, label: t.contact.helpline, value: '1800-599-2100' },
    { icon: Mail, label: t.contact.emailLabel, value: 'help@crowdsense.in' },
    { icon: MapPin, label: t.contact.address, value: t.contact.addressValue },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">{t.contact.title}</h1>
      <p className="mt-2 text-base text-slate-600">{t.contact.subtitle}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-5">
        <div className="space-y-4 md:col-span-2">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <div
                key={info.label}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-card p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {info.label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">
                    {info.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="md:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t.contact.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contact.namePlaceholder}
                className={inputClass(errors.name)}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t.contact.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.contact.emailPlaceholder}
                className={inputClass(errors.email)}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t.contact.message}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contact.messagePlaceholder}
                rows={4}
                className={inputClass(errors.message)}
              />
              {errors.message && (
                <p className="mt-1.5 text-xs font-medium text-red-600">{errors.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-white transition hover:bg-primary-600"
            >
              <Send className="h-5 w-5" />
              {t.contact.send}
            </button>
            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                {t.contact.success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
