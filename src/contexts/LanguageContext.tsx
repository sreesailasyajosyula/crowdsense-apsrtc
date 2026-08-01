import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { translations, type Lang, type Translation } from '@/i18n/translations';

type LanguageContextValue = {
  lang: Lang;
  t: Translation;
  hasSelectedLang: boolean;
  setLanguage: (lang: Lang) => void;
  selectLanguage: (lang: Lang) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'crowdsense-lang';
const SELECTED_KEY = 'crowdsense-lang-selected';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'te' ? stored : 'te';
  });

  const [hasSelectedLang, setHasSelectedLang] = useState<boolean>(() => {
    return localStorage.getItem(SELECTED_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLanguage = (next: Lang) => setLang(next);

  const selectLanguage = (next: Lang) => {
    setLang(next);
    setHasSelectedLang(true);
    localStorage.setItem(SELECTED_KEY, 'true');
  };

  const toggleLanguage = () => setLang((prev) => (prev === 'te' ? 'en' : 'te'));

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t: translations[lang],
        hasSelectedLang,
        setLanguage,
        selectLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
