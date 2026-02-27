import React, { useState, useEffect, useCallback } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Patients from './Patients';
import Schedule from './Schedule';
import Settings from './Settings';
import Shortcuts from './Shortcuts';
import Sidebar from './Sidebar';

function App({ initialLayout = 'right' }) {
  const [route, setRoute] = useState('login');
  const [layoutMode, setLayoutMode] = useState(initialLayout);
  const [isAuthed, setIsAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.layout = layoutMode;
  }, [layoutMode]);

  useEffect(() => {
    window.careconnect.onNavigate((r) => {
      if (r === 'toggleSidebar') { setSidebarOpen(prev => !prev); return; }
      if (r === 'quickSearch') { document.querySelector('[data-search]')?.focus(); return; }
      if (isAuthed) setRoute(r);
    });
    window.careconnect.onLogout(() => { setIsAuthed(false); setRoute('login'); });
    window.careconnect.onLayoutChanged((mode) => setLayoutMode(mode));
  }, [isAuthed]);

  const navigate = useCallback((next) => {
    if (isAuthed || next === 'login') setRoute(next);
  }, [isAuthed]);

  const handleLogin = useCallback(() => {
    setIsAuthed(true);
    setRoute('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthed(false);
    setRoute('login');
  }, []);

  const handleToggleLayout = useCallback(async () => {
    const newMode = layoutMode === 'left' ? 'right' : 'left';
    const saved = await window.careconnect.setLayoutMode(newMode);
    setLayoutMode(saved);
  }, [layoutMode]);

  const handleSaveLayout = useCallback(async (mode) => {
    const saved = await window.careconnect.setLayoutMode(mode);
    setLayoutMode(saved);
  }, []);

  // CROSS-PLATFORM KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isAuthed) return;

      // Check for Modifier (Cmd on Mac, Ctrl on Windows)
      const modifier = e.metaKey || e.ctrlKey;
      
      // Map keys to routes
      const shortcuts = {
        'F1': 'dashboard',
        '1':  'dashboard',
        'F2': 'tasks',
        '2':  'tasks',
        'F3': 'schedule',
        '3':  'schedule',
        'F4': 'patients',
        '4':  'patients'
      };

      const targetRoute = shortcuts[e.key];

      if (targetRoute) {
        // If it's a number key (1-4), require the modifier (Cmd/Ctrl)
        // If it's an F-key, trigger directly (for Windows/Linux or Mac with fn)
        const isNumber = e.key >= '1' && e.key <= '4';
        
        if (!isNumber || (isNumber && modifier)) {
          e.preventDefault();
          navigate(targetRoute);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthed, navigate]);

  if (!isAuthed || route === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div
      className="app-shell"
      style={{ flexDirection: layoutMode === 'left' ? 'row-reverse' : 'row' }}
    >
      <Sidebar
        route={route}
        open={sidebarOpen}
        layoutMode={layoutMode}
        onNavigate={navigate}
        onToggleLayout={handleToggleLayout}
        onLogout={handleLogout}
      />
      <div className="app-content" id="main" tabIndex="-1" aria-label="Main content">
        {route === 'dashboard' && <Dashboard layoutMode={layoutMode} onNavigate={navigate} />}
        {route === 'tasks' && <Tasks />}
        {route === 'patients' && <Patients />}
        {route === 'schedule' && <Schedule />}
        {route === 'settings' && (
          <Settings
            layoutMode={layoutMode}
            onSave={handleSaveLayout}
            onBack={() => navigate('dashboard')}
          />
        )}
        {route === 'shortcuts' && <Shortcuts onBack={() => navigate('dashboard')} />}
        {route === 'about' && (
          <div className="page-content">
            <h1>About CareConnect</h1>
            <p>CareConnect Desktop — Electron + React</p>
            <p>Designed for left-handed caregivers.</p>
            <button className="btn" onClick={() => navigate('dashboard')}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;