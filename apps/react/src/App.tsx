import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Login } from './app/components/Login';
import { CareConnectNavigation } from './app/components/CareConnectNavigation';
import { CareConnectDashboard } from './app/components/CareConnectDashboard';
import { TaskManagement } from './app/components/TaskManagement';
import { SchedulePage } from './app/components/SchedulePage';
import { PatientCare } from './app/components/PatientCare';
import { SettingsPage } from './app/components/SettingsPage';
import { useAppContext } from './app/context/AppContext';

function AppLayout() {
  const { state, logout, setSidebarPosition } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const activeView = location.pathname === '/' ? 'dashboard' : location.pathname.replace('/', '');

  const handleNavigate = (id: string) => {
    navigate(id === 'dashboard' ? '/' : `/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <CareConnectNavigation
        activeItem={activeView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        sidebarPosition={state.sidebarPosition}
        onSidebarPositionChange={setSidebarPosition}
      />
      <main
        id="main-content"
        role="main"
        className={`min-h-screen pb-16 md:pb-0 transition-all duration-300 ${
          state.sidebarPosition === 'left' ? 'md:pl-20 lg:pl-64' : 'md:pr-20 lg:pr-64'
        }`}
      >
        <Routes>
          <Route path="/" element={<CareConnectDashboard />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/patients" element={<PatientCare />} />
          <Route path="/settings" element={
            <SettingsPage
              leftHandedMode={state.sidebarPosition === 'right'}
              onLeftHandedChange={setSidebarPosition}
            />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { state, login } = useAppContext();

  if (!state.isLoggedIn) {
    return <Login onLogin={login} />;
  }

  return <AppLayout />;
}
