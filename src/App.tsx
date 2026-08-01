import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LanguageSelection } from '@/pages/LanguageSelection';
import { Home } from '@/pages/Home';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { AddJourney } from '@/pages/AddJourney';
import { RouteInsights } from '@/pages/RouteInsights';
import { MyJourney } from '@/pages/MyJourney';
import { Profile } from '@/pages/Profile';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Privacy, Terms } from '@/pages/Legal';
import { AdminApp } from '@/components/admin/AdminApp';

function AppContent() {
  const { hasSelectedLang } = useLanguage();
  const { view } = useNavigation();

  if (!hasSelectedLang) {
    return <LanguageSelection />;
  }

  const renderView = () => {
    switch (view) {
      case 'home':
        return <Home />;
      case 'dashboard':
        return <Dashboard />;
      case 'login':
        return <Login />;
      case 'addJourney':
        return <AddJourney />;
      case 'routeInsights':
        return <RouteInsights />;
      case 'myJourney':
        return <MyJourney />;
      case 'profile':
        return <Profile />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{renderView()}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const isAdminPath =
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return (
      <LanguageProvider>
        <NavigationProvider>
          <AdminApp />
        </NavigationProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </LanguageProvider>
  );
}
