import { useState } from 'react';
import { Login } from './app/components/Login';
import { CareConnectNavigation } from './app/components/CareConnectNavigation';
import { CareConnectDashboard } from './app/components/CareConnectDashboard';
import { TaskManagement } from './app/components/TaskManagement';
import { SchedulePage } from './app/components/SchedulePage';
import { PatientCare } from './app/components/PatientCare';
import { SettingsPage } from './app/components/SettingsPage';

type ViewType = 'dashboard' | 'tasks' | 'schedule' | 'patients' | 'settings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left');

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <CareConnectNavigation
        activeItem={activeView}
        onNavigate={(id) => setActiveView(id as ViewType)}
        onLogout={() => setIsLoggedIn(false)}
        sidebarPosition={sidebarPosition}
        onSidebarPositionChange={setSidebarPosition}
      />
      <main className={`min-h-screen pb-16 md:pb-0 transition-all duration-300 ${sidebarPosition === 'left' ? 'md:pl-20 lg:pl-64' : 'md:pr-20 lg:pr-64'}`}>
        {activeView === 'dashboard' && <CareConnectDashboard />}
        {activeView === 'tasks' && <TaskManagement />}
        {activeView === 'schedule' && <SchedulePage />}
        {activeView === 'patients' && <PatientCare />}
        {activeView === 'settings' && <SettingsPage onLeftHandedChange={setSidebarPosition} leftHandedMode={sidebarPosition === 'right'} />}
      </main>
    </div>
  );
}
