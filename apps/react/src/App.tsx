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

  // Fix: handle the dashboard case so it matches '/' correctly
  const activeView = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

  const handleNavigate = (id: string) => {
    navigate(id === 'dashboard' ? '/' : `/${id}`);
  };

  const handleLogout = () => {
    logout();
    // Redirect happens automatically now because of the state change in the main App component
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
          <Route path="/settings" element={<SettingsPage />} />
          {/* Catch-all for logged-in users to prevent broken URLs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { state, login } = useAppContext();

  return (
    <Routes>
      {/* If not logged in, only the Login route exists. 
          Everything else redirects to /login */}
      {!state.isLoggedIn ? (
        <>
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        /* If logged in, the /login route is gone, 
           and we show the AppLayout (which contains its own Routes) */
        <Route path="*" element={<AppLayout />} />
      )}
    </Routes>
  );
}