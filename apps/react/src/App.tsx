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

// AppLayout renders the authenticated shell:
// navigation sidebar + main content area with route-based page switching.
// It is only mounted when state.isLoggedIn is true.
function AppLayout() {
  const { state, logout, setSidebarPosition } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Apply global CSS classes and font scaling whenever relevant settings change.
  // Uses globalThis instead of window for cross-environment compatibility.
  useEffect(() => {
    const root = globalThis.document.documentElement;

    // 1. Theme — adds/removes the 'dark' class on <html> for Tailwind dark mode
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. High Contrast — adds/removes a CSS class used by accessibility overrides
    if (state.settings.highContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // 3. Zoom / Font Scaling — converts the stored percentage string to a px font-size.
    // Number.parseInt is preferred over parseInt per SonarQube (explicit global reference).
    const zoomPercent = Number.parseInt(state.settings.defaultZoom, 10) || 100;
    root.style.fontSize = `${(zoomPercent / 100) * 16}px`;

  }, [state.settings.theme, state.settings.highContrastMode, state.settings.defaultZoom]);

  // Derive the active nav item from the current URL segment
  // Defaults to 'dashboard' for the root path
  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  // Maps nav item IDs to their React Router paths
  const handleNavigate = (id: string) => {
    const routeMap: Record<string, string> = {
      dashboard: '/',
      tasks:     '/tasks',
      schedule:  '/schedule',
      patients:  '/patients',
      settings:  '/settings',
    };
    navigate(routeMap[id] ?? '/');
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-50">

      {/* Persistent navigation — sidebar on desktop, bottom bar on mobile */}
      <CareConnectNavigation
        activeItem={currentPath}
        onNavigate={handleNavigate}
        onLogout={logout}
        sidebarPosition={state.sidebarPosition}
        onSidebarPositionChange={setSidebarPosition}
      />

      {/* Main content area — offset by sidebar width depending on its position */}
      <main
        id="main-content"
        className={`min-h-screen pb-20 md:pb-0 transition-all duration-300 ease-in-out ${
          state.sidebarPosition === 'left'
            ? 'md:pl-20 lg:pl-64' // Sidebar on left: push content right
            : 'md:pr-20 lg:pr-64' // Sidebar on right: push content left
        }`}
      >
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Routes>
            <Route path="/"          element={<CareConnectDashboard />} />
            <Route path="/tasks"     element={<TaskManagement />}       />
            <Route path="/schedule"  element={<SchedulePage />}         />
            <Route path="/patients"  element={<PatientCare />}          />
            <Route path="/settings"  element={<SettingsPage />}         />
            {/* Catch-all — redirects unknown authenticated paths to the dashboard */}
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// Root component — switches between the public login route and the protected app shell.
// Avoids a negated condition by checking isLoggedIn positively:
// authenticated users get AppLayout, unauthenticated users get Login + redirect.
export default function App() {
  const { state, login } = useAppContext();

  return (
    <Routes>
      {state.isLoggedIn ? (
        // Protected routes — full app shell with navigation and page routing
        <Route path="*" element={<AppLayout />} />
      ) : (
        <>
          {/* Public route — login page */}
          <Route path="/login" element={<Login onLogin={login} />} />
          {/* Redirect any unauthenticated access to the login page */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}
