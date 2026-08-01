import { useState } from 'react';
import { Phone, ShieldCheck, ArrowRight, Info, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { signInWithToken } from '@/lib/authService';
import { api, ApiError } from '@/lib/api';

type Step = 'phone' | 'otp';

export function Login() {
  const { t } = useLanguage();
  const { navigate } = useNavigation();

  const [step, setStep] = useState<Step>('phone');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ mobile?: string; otp?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const requestOtp = async () => {
    const { devOtp: code } = await api.post<{ devOtp: string }>('/api/auth/otp/send', {
      mobile,
    });
    setDevOtp(code);
    setStep('otp');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile.trim())) {
      setErrors({ mobile: t.login.errorMobile });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await requestOtp();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not send OTP. Please try again.';
      setErrors({ mobile: message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp.trim())) {
      setErrors({ otp: t.login.errorOtp });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const { customToken } = await api.post<{ customToken: string }>('/api/auth/otp/verify', {
        mobile,
        code: otp.trim(),
      });
      await signInWithToken(customToken);
      // NavigationContext's onAuthStateChanged listener picks this up,
      // syncs the user with the backend, and sets isLoggedIn automatically.
      setSuccess(true);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t.login.errorOtpInvalid;
      setErrors({ otp: message });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-ink">{t.login.success}</h2>
        <button
          onClick={() => navigate('dashboard')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition hover:bg-primary-600"
        >
          {t.common.toDashboard}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-ink">{t.login.title}</h1>
        <p className="mt-1.5 text-sm text-slate-600">{t.login.subtitle}</p>

        <div className="mt-5 flex items-start gap-2 rounded-lg bg-primary-50 p-3 text-sm text-primary">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t.login.demoNote}</span>
        </div>

        {step === 'otp' && devOtp && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Dev mode — no real SMS is sent yet. Your OTP is:{' '}
              <span className="font-bold tracking-widest">{devOtp}</span>
            </span>
          </div>
        )}

        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t.login.mobile}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder={t.login.mobilePlaceholder}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    errors.mobile
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-slate-200 focus:border-primary focus:ring-primary-100'
                  }`}
                />
              </div>
              {errors.mobile && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.mobile}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
            >
              {loading ? 'Sending…' : t.login.sendOtp}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
            <p className="text-sm text-slate-600">
              {t.login.otpSentTo} <span className="font-medium text-ink">+91 {mobile}</span>
            </p>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t.login.otpLabel}
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={t.login.otpPlaceholder}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm tracking-widest text-ink outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    errors.otp
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-slate-200 focus:border-primary focus:ring-primary-100'
                  }`}
                />
              </div>
              {errors.otp && (
                <p className="mt-1.5 text-xs font-medium text-red-600">{errors.otp}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
            >
              {loading ? 'Verifying…' : t.login.verify}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        )}

        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            onClick={() => {
              setStep('phone');
              setOtp('');
              setDevOtp(null);
              setErrors({});
            }}
            className="font-medium text-primary hover:underline"
          >
            {step === 'otp' ? t.login.changeNumber : ''}
          </button>
          {step === 'otp' && (
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await requestOtp();
                } catch (err) {
                  const message = err instanceof ApiError ? err.message : 'Could not resend OTP.';
                  setErrors({ otp: message });
                } finally {
                  setLoading(false);
                }
              }}
              className="font-medium text-slate-500 hover:text-slate-700"
            >
              {t.login.resendOtp}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
