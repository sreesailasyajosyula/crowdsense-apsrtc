import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';

export type AdminPage =
  | 'dashboard'
  | 'priorityRoutes'
  | 'crowdAnalytics'
  | 'aiRecommendations'
  | 'reports'
  | 'settings';

type AdminContextValue = {
  page: AdminPage;
  isLoggedIn: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  selectedRouteId: string | number;
  logout: () => Promise<void>;
  navigate: (page: AdminPage) => void;
  selectRoute: (id: string | number) => void;
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, user, authLoading, logout: navLogout } = useNavigation();
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [selectedRouteId, setSelectedRouteId] = useState<string | number>(1);

  const navigate = (next: AdminPage) => setPage(next);
  const selectRoute = (id: string | number) => setSelectedRouteId(id);

  return (
    <AdminContext.Provider
      value={{
        page,
        isLoggedIn,
        isAdmin: !!user?.isAdmin,
        authLoading,
        selectedRouteId,
        logout: navLogout,
        navigate,
        selectRoute,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
