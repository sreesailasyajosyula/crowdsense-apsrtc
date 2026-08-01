import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { watchAuthState, logOut as firebaseLogOut } from '@/lib/authService';
import { api } from '@/lib/api';

export type View =
  | 'home'
  | 'dashboard'
  | 'about'
  | 'contact'
  | 'login'
  | 'addJourney'
  | 'routeInsights'
  | 'myJourney'
  | 'profile'
  | 'privacy'
  | 'terms';

export interface AppUser {
  uid: string;
  phoneNumber: string;
  name: string | null;
  preferredLanguage: 'en' | 'te';
  isAdmin: boolean;
}

type NavContextValue = {
  view: View;
  isLoggedIn: boolean;
  authLoading: boolean;
  user: AppUser | null;
  userName: string;
  navigate: (view: View) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const NavContext = createContext<NavContextValue | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('home');
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const syncAndSetUser = async () => {
    try {
      const { user: synced } = await api.post<{ user: AppUser }>('/api/auth/sync', {
        preferredLanguage: 'en',
      });
      setUser(synced);
    } catch (err) {
      console.error('Failed to sync user with backend:', err);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const { user: fresh } = await api.get<{ user: AppUser }>('/api/auth/me');
      setUser(fresh);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = watchAuthState(async (firebaseUser) => {
      setAuthLoading(true);
      if (firebaseUser) {
        await syncAndSetUser();
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await firebaseLogOut();
    setUser(null);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavContext.Provider
      value={{
        view,
        isLoggedIn: !!user,
        authLoading,
        user,
        userName: user?.name ?? (user ? `User${user.phoneNumber.slice(-4)}` : ''),
        navigate,
        logout,
        refreshUser,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavigation() {
  const ctx = useContext(NavContext);
  if (!ctx)
    throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}
