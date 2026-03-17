import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Login } from './app/components/Login';
import { CareConnectNavigation } from './app/components/CareConnectNavigation';
import { CareConnectDashboard } from './app/components/CareConnectDashboard';
import { TaskManagement } from './app/components/TaskManagement';
import { SchedulePage } from './app/components/SchedulePage';
import { PatientCare } from './app/components/PatientCare';
import { SettingsPage } from './app/components/SettingsPage';
import { useAppContext } from './app/context/AppContext';
import { useEffect } from 'react';

function AppLayout() {
  const { state, logout, setSidebarPosition } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;

    // 1. Theme Management
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. High Contrast Accessibility
    if (state.settings.highContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // 3. Dynamic Zoom / Font Scaling
    const zoomPercent = parseInt(state.settings.defaultZoom) || 100;
    root.style.fontSize = `${(zoomPercent / 100) * 16}px`;

  }, [state.settings.theme, state.settings.highContrastMode, state.settings.defaultZoom]);

  // Derive active view from URL path
  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  const handleNavigate = (id: string) => {
    // Map internal IDs to Routes
    const routeMap: Record<string, string> = {
      dashboard: '/',
      tasks: '/tasks',
      schedule: '/schedule',
      patients: '/patients',
      settings: '/settings'
    };
    navigate(routeMap[id] || '/');
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-50">
      <CareConnectNavigation
        activeItem={currentPath}
        onNavigate={handleNavigate}
        onLogout={logout}
        sidebarPosition={state.sidebarPosition}
        onSidebarPositionChange={setSidebarPosition}
      />
      
      <main
        id="main-content"
        role="main"
        className={`min-h-screen pb-20 md:pb-0 transition-all duration-300 ease-in-out ${
          state.sidebarPosition === 'left' 
            ? 'md:pl-20 lg:pl-64' // Sidebar on left: push content right
            : 'md:pr-20 lg:pr-64' // Sidebar on right: push content left
        }`}
      >
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Routes>
            <Route path="/" element={<CareConnectDashboard />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/patients" element={<PatientCare />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Fallback for authenticated users */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const { state, login } = useAppContext();

  return (
    <Routes>
      {!state.isLoggedIn ? (
        <>
          {/* Public Routes */}
          <Route path="/login" element={<Login onLogin={login} />} />
          {/* Redirect any unauthenticated access to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        /* Protected App Routes */
        <Route path="*" element={<AppLayout />} />
      )}
    </Routes>
  );
}