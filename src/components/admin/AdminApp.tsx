import { useState } from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Login } from '@/pages/Login';
import { AdminSidebar, AdminMobileNav } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminPriorityRoutes } from '@/pages/admin/AdminPriorityRoutes';
import { AdminCrowdAnalytics } from '@/pages/admin/AdminCrowdAnalytics';
import { AdminAIRecommendations } from '@/pages/admin/AdminAIRecommendations';
import { AdminReports } from '@/pages/admin/AdminReports';
import { AdminSettings } from '@/pages/admin/AdminSettings';

function AccessDenied() {
  const { t } = useLanguage();
  const { logout } = useAdmin();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-admin-bg px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <ShieldAlert className="h-8 w-8" />
      </span>
      <h1 className="mt-5 text-xl font-bold text-white">Admin access required</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        Your account is logged in, but it isn't marked as an admin. Only
        specific APSRTC staff numbers have access to this panel.
      </p>
      <button
        onClick={() => logout()}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
      >
        <LogOut className="h-4 w-4" />
        {t.nav.logout}
      </button>
    </div>
  );
}

function AdminContent() {
  const { isLoggedIn, isAdmin, authLoading, page } = useAdmin();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-admin-bg">
        <div className="mx-auto max-w-md pt-16">
          <p className="mb-4 text-center text-sm text-slate-400">
            Admin Panel — please log in with your registered admin phone number
          </p>
        </div>
        <Login />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <AdminDashboardPage />;
      case 'priorityRoutes':
        return <AdminPriorityRoutes />;
      case 'aiRecommendations':
        return <AdminAIRecommendations />;
      case 'reports':
        return <AdminReports />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboardPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-admin-bg">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <AdminMobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
}

export function AdminApp() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}
