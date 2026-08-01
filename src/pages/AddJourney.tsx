import { useState } from 'react';
import { Plus, ArrowRight, CheckCircle2, LogIn, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigation } from '@/contexts/NavigationContext';
import type { CrowdLevel } from '@/data/placeholderData';
import { api, ApiError } from '@/lib/api';

export function AddJourney() {
  const { t } = useLanguage();
  const { isLoggedIn, navigate } = useNavigation();
  const [date, setDate] = useState('');
  const [routeNo, setRouteNo] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [time, setTime] = useState('');
  const [seatAvailable, setSeatAvailable] = useState<boolean | null>(null);
  const [standing, setStanding] = useState<boolean | null>(null);
  const [waitingTime, setWaitingTime] = useState('');
  const [crowd, setCrowd] = useState<CrowdLevel | ''>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
          <LogIn className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-ink">
          {t.addJourney.loginRequired}
        </h2>
        <button
          onClick={() => navigate('login')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
        >
          {t.nav.passengerLogin}
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!date) next.date = t.addJourney.errorDate;
    if (!routeNo.trim()) next.routeNo = t.addJourney.errorRouteNo;
    if (!from.trim()) next.from = t.addJourney.errorFrom;
    if (!to.trim()) next.to = t.addJourney.errorTo;
    if (!time) next.time = 'Please select a time.';
    if (!crowd) next.crowd = t.addJourney.errorCrowd;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await api.post('/api/journeys', {
        date,
        routeNo: routeNo.trim(),
        from: from.trim(),
        to: to.trim(),
        time,
        seatAvailable: seatAvailable ?? false,
        standing: standing ?? false,
        waitingTime: Number(waitingTime) || 0,
        crowd,
        notes: notes.trim(),
      });
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not save your journey. Please try again.';
      setErrors({ submit: message });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-ink">
          {t.addJourney.success}
        </h2>
        <button
          onClick={() => navigate('dashboard')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
        >
          {t.nav.dashboard}
        </button>
      </div>
    );
  }

  const crowdOptions: { value: CrowdLevel; label: string; color: string }[] = [
    { value: 'low', label: t.addJourney.low, color: 'green' },
    { value: 'medium', label: t.addJourney.medium, color: 'orange' },
    { value: 'high', label: t.addJourney.high, color: 'red' },
  ];

  const inputClass = (err?: string) =>
    `w-full rounded-xl border bg-white py-3 px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:ring-2 ${
      err
        ? 'border-red-300 focus:ring-red-200'
        : 'border-slate-200 focus:border-primary focus:ring-primary-100'
    }`;

  const yesNoBtn = (selected: boolean | null, onYes: () => void, onNo: () => void) => (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onYes}
        className={`rounded-xl border-2 py-2.5 text-sm font-semibold transition ${
          selected === true
            ? 'border-primary bg-primary-50 text-primary'
            : 'border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        {t.addJourney.standingYes}
      </button>
      <button
        type="button"
        onClick={onNo}
        className={`rounded-xl border-2 py-2.5 text-sm font-semibold transition ${
          selected === false
            ? 'border-primary bg-primary-50 text-primary'
            : 'border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        {t.addJourney.standingNo}
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">{t.addJourney.title}</h1>
        <p className="mt-1.5 text-sm text-slate-600">{t.addJourney.subtitle}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t.addJourney.journeyDate}
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClass(errors.date)} pl-10`}
            />
          </div>
          {errors.date && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t.addJourney.routeNo}
          </label>
          <input
            type="text"
            value={routeNo}
            onChange={(e) => setRouteNo(e.target.value)}
            placeholder={t.addJourney.routeNoPlaceholder}
            className={inputClass(errors.routeNo)}
          />
          {errors.routeNo && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.routeNo}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t.addJourney.from}
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder={t.addJourney.fromPlaceholder}
              className={inputClass(errors.from)}
            />
            {errors.from && (
              <p className="mt-1.5 text-xs font-medium text-red-600">{errors.from}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t.addJourney.to}
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder={t.addJourney.toPlaceholder}
              className={inputClass(errors.to)}
            />
            {errors.to && (
              <p className="mt-1.5 text-xs font-medium text-red-600">{errors.to}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t.addJourney.time}
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClass()}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t.addJourney.waitingTime}
            </label>
            <input
              type="number"
              min="0"
              value={waitingTime}
              onChange={(e) => setWaitingTime(e.target.value)}
              placeholder={t.addJourney.waitingPlaceholder}
              className={inputClass()}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {t.addJourney.seatAvailable}
          </label>
          {yesNoBtn(
            seatAvailable,
            () => setSeatAvailable(true),
            () => setSeatAvailable(false)
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {t.addJourney.standingTravel}
          </label>
          {yesNoBtn(
            standing,
            () => setStanding(true),
            () => setStanding(false)
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {t.addJourney.crowdLevel}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {crowdOptions.map((opt) => {
              const selected = crowd === opt.value;
              const colorMap: Record<string, string> = {
                green: selected
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 text-slate-600 hover:border-green-300',
                orange: selected
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-slate-200 text-slate-600 hover:border-orange-300',
                red: selected
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-slate-200 text-slate-600 hover:border-red-300',
              };
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCrowd(opt.value)}
                  className={`rounded-xl border-2 py-3 text-sm font-semibold transition ${colorMap[opt.color]}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {errors.crowd && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.crowd}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t.addJourney.notes}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.addJourney.notesPlaceholder}
            rows={3}
            className={inputClass()}
          />
        </div>

        {errors.submit && (
          <p className="text-sm font-medium text-red-600">{errors.submit}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
        >
          <Plus className="h-5 w-5" />
          {submitting ? 'Saving…' : t.addJourney.submit}
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
