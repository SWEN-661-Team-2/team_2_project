import { useState } from 'react';
import { Login } from './app/components/Login';
import { CareConnectNavigation } from './app/components/CareConnectNavigation';
import { CareConnectDashboard } from './app/components/CareConnectDashboard';


type ViewType = 'dashboard' | 'tasks' | 'schedule' | 'patients' | 'settings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <CareConnectNavigation
        activeItem={activeView}
        onNavigate={(id) => setActiveView(id as ViewType)}
        onLogout={() => setIsLoggedIn(false)}
      />
      <main className="md:pl-20 lg:pl-64 min-h-screen pb-16 md:pb-0">
        {activeView === 'dashboard' && <CareConnectDashboard />}
      </main>
    </div>
  );
}
