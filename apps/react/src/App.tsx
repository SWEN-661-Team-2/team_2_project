// import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// import { Login } from './app/components/Login';
// import { CareConnectNavigation } from './app/components/CareConnectNavigation';
// import { CareConnectDashboard } from './app/components/CareConnectDashboard';
// import { TaskManagement } from './app/components/TaskManagement';
// import { SchedulePage } from './app/components/SchedulePage';
// import { PatientCare } from './app/components/PatientCare';
// import { SettingsPage } from './app/components/SettingsPage';
// import { useAppContext } from './app/context/AppContext';
// import { useEffect } from 'react';

// // function AppLayout() {
// //   const { state, logout, setSidebarPosition } = useAppContext();
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // Fix: handle the dashboard case so it matches '/' correctly
// //   const activeView = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

// //   const handleNavigate = (id: string) => {
// //     navigate(id === 'dashboard' ? '/' : `/${id}`);
// //   };

// //   const handleLogout = () => {
// //     logout();
// //     // Redirect happens automatically now because of the state change in the main App component
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
// //       <CareConnectNavigation
// //         activeItem={activeView}
// //         onNavigate={handleNavigate}
// //         onLogout={handleLogout}
// //         sidebarPosition={state.sidebarPosition}
// //         onSidebarPositionChange={setSidebarPosition}
// //       />
// //       <main
// //         id="main-content"
// //         role="main"
// //         className={`min-h-screen pb-16 md:pb-0 transition-all duration-300 ${
// //           state.sidebarPosition === 'left' ? 'md:pl-20 lg:pl-64' : 'md:pr-20 lg:pr-64'
// //         }`}
// //       >
// //         <Routes>
// //           <Route path="/" element={<CareConnectDashboard />} />
// //           <Route path="/tasks" element={<TaskManagement />} />
// //           <Route path="/schedule" element={<SchedulePage />} />
// //           <Route path="/patients" element={<PatientCare />} />
// //           <Route path="/settings" element={<SettingsPage />} />
// //           {/* Catch-all for logged-in users to prevent broken URLs */}
// //           <Route path="*" element={<Navigate to="/" replace />} />
// //         </Routes>
// //       </main>
// //     </div>
// //   );
// // }
// function AppLayout() {
//   const { state, logout, setSidebarPosition } = useAppContext();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 1. Handle Theme & Zoom Persistence
//   useEffect(() => {
//     const root = window.document.documentElement;

//     // Apply Dark Mode Class
//     if (state.settings.theme === 'dark') {
//       root.classList.add('dark');
//     } else {
//       root.classList.remove('dark');
//     }

//     // Apply Zoom Level
//     // This scales the entire UI based on the percentage in your settings
//     root.style.fontSize = state.settings.defaultZoom === '100%'
//       ? '16px'
//       : `calc(16px * ${parseInt(state.settings.defaultZoom) / 100})`;

//   }, [state.settings.theme, state.settings.defaultZoom]);

//   const activeView = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

//   const handleNavigate = (id: string) => {
//     navigate(id === 'dashboard' ? '/' : `/${id}`);
//   };

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     /* The outermost wrapper handles the base gradient and text color for the whole app */
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300">
//       <CareConnectNavigation
//         activeItem={activeView}
//         onNavigate={handleNavigate}
//         onLogout={handleLogout}
//         sidebarPosition={state.sidebarPosition}
//         onSidebarPositionChange={setSidebarPosition}
//       />
//       <main
//         id="main-content"
//         role="main"
//         /* FIX: We added 'dark:bg-slate-900/50' so the main area darkens, 
//            and 'dark:text-white' to ensure visibility. 
//         */
//         className={`min-h-screen pb-16 md:pb-0 transition-all duration-300 ${state.sidebarPosition === 'left' ? 'md:pl-20 lg:pl-64' : 'md:pr-20 lg:pr-64'
//           } bg-transparent dark:bg-slate-900/20`}
//       >
//         <Routes>
//           <Route path="/" element={<CareConnectDashboard />} />
//           <Route path="/tasks" element={<TaskManagement />} />
//           <Route path="/schedule" element={<SchedulePage />} />
//           <Route path="/patients" element={<PatientCare />} />
//           <Route path="/settings" element={<SettingsPage />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default function App() {
//   const { state, login } = useAppContext();

//   return (
//     <Routes>
//       {/* If not logged in, only the Login route exists. 
//           Everything else redirects to /login */}
//       {!state.isLoggedIn ? (
//         <>
//           <Route path="/login" element={<Login onLogin={login} />} />
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </>
//       ) : (
//         /* If logged in, the /login route is gone, 
//            and we show the AppLayout (which contains its own Routes) */
//         <Route path="*" element={<AppLayout />} />
//       )}
//     </Routes>
//   );
// }

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

    // 1. Toggle Dark Mode
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. Toggle High Contrast (Adding a class we can use in CSS)
    if (state.settings.highContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // 3. Apply Zoom Level
    root.style.fontSize = state.settings.defaultZoom === '100%'
      ? '16px'
      : `calc(16px * ${parseInt(state.settings.defaultZoom) / 100})`;

  }, [state.settings.theme, state.settings.highContrastMode, state.settings.defaultZoom]);

  const activeView = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

  const handleNavigate = (id: string) => {
    navigate(id === 'dashboard' ? '/' : `/${id}`);
  };

  return (
    /* CRITICAL FIX: 
      We use 'dark:bg-slate-950' as a fallback color. 
      The gradient now explicitly defines dark colors (dark:from-slate-950 dark:to-slate-900).
    */
    <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-50">
      <CareConnectNavigation
        activeItem={activeView}
        onNavigate={handleNavigate}
        onLogout={logout}
        sidebarPosition={state.sidebarPosition}
        onSidebarPositionChange={setSidebarPosition}
      />
      <main
        id="main-content"
        role="main"
        /* Using 'bg-transparent' here ensures the main area 
           doesn't block the dark gradient behind it. 
        */
        className={`min-h-screen pb-16 md:pb-0 transition-all duration-300 bg-transparent ${
          state.sidebarPosition === 'left' ? 'md:pl-20 lg:pl-64' : 'md:pr-20 lg:pr-64'
        }`}
      >
        <Routes>
          <Route path="/" element={<CareConnectDashboard />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/patients" element={<PatientCare />} />
          <Route path="/settings" element={<SettingsPage />} />
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
      {!state.isLoggedIn ? (
        <>
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route path="*" element={<AppLayout />} />
      )}
    </Routes>
  );
}