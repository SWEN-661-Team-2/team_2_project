import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  const isAuthedRef = useRef(isAuthed);
  useEffect(() => {
    isAuthedRef.current = isAuthed;
  }, [isAuthed]);

  useEffect(() => {
    document.documentElement.dataset.layout = layoutMode;
  }, [layoutMode]);

  useEffect(() => {


// Check if the bridge exists before setting up listeners
  if (window.careconnect) {
    window.careconnect.onNavigate((r) => {
      if (r === 'toggleSidebar') { setSidebarOpen(prev => !prev); return; }
      if (r === 'quickSearch') { document.querySelector('[data-search]')?.focus(); return; }
      if (isAuthedRef.current) setRoute(r);
    });
    window.careconnect.onLogout(() => { setIsAuthed(false); setRoute('login'); });
    window.careconnect.onLayoutChanged((mode) => setLayoutMode(mode));
  }



    return () => {
      window.careconnect.removeAllListeners('nav:go');
      window.careconnect.removeAllListeners('auth:logout');
      window.careconnect.removeAllListeners('layout:changed');
    };
  }, []);

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