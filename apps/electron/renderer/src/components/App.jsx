import React, { useState, useEffect, useCallback } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Patients from './Patients';
import Schedule from './Schedule';
import Settings from './Settings';
import Shortcuts from './Shortcuts';
import Sidebar from './Sidebar';
import NewPatientModal from './NewPatientModal'; // ADDED THIS IMPORT

function App({ initialLayout = 'right' }) {
  const [route, setRoute] = useState('login');
  const [layoutMode, setLayoutMode] = useState(initialLayout);
  const [isAuthed, setIsAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false); // Modal state

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

  // CROSS-PLATFORM KEYBOARD SHORTCUTS & QUICK ACTIONS
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isAuthed) return;

      const modifier = e.metaKey || e.ctrlKey;
      const shift = e.shiftKey;
      const key = e.key.toLowerCase();

      if (modifier) {
        // --- GLOBAL MODAL TRIGGER: Cmd/Ctrl + J ---
        if (key === 'j') {
          e.preventDefault();
          e.stopPropagation();
          setIsPatientModalOpen(true);
          return;
        }

        // 1. Sidebar Toggle (Cmd/Ctrl + B)
        if (key === 'b') {
          e.preventDefault();
          setSidebarOpen(prev => !prev);
          return;
        }

        // 2. Quick Search (Cmd/Ctrl + K)
        if (key === 'k') {
          e.preventDefault();
          document.querySelector('[data-search]')?.focus();
          return;
        }

        // 3. Creation Actions (N / Shift + N)
        if (key === 'n') {
          e.preventDefault();
          if (shift) {
            navigate('schedule');
            window.history.replaceState({}, '', '#/schedule?openNew=true');
          } else {
            navigate('tasks');
            window.history.replaceState({}, '', '#/tasks?openNew=true');
          }
          return;
        }

        // 4. Data Actions (E / I)
        if (key === 'e') {
          e.preventDefault();
          console.log("Export triggered...");
          return;
        }
        if (key === 'i') {
          e.preventDefault();
          console.log("Import triggered...");
          return;
        }
      }

      // 5. Navigation (F1-F4 or Cmd/Ctrl + 1-4)
      const navShortcuts = {
        '1': 'dashboard', 'f1': 'dashboard',
        '2': 'tasks',     'f2': 'tasks',
        '3': 'schedule',  'f3': 'schedule',
        '4': 'patients',  'f4': 'patients'
      };

      if (navShortcuts[key]) {
        const isNumber = key >= '1' && key <= '4';
        if (!isNumber || (isNumber && modifier)) {
          e.preventDefault();
          navigate(navShortcuts[key]);
        }
      }
    };

    // Use 'true' (Capture phase) to ensure we beat system defaults like Cmd+P
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
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

      {/* GLOBAL MODALS */}
      {isPatientModalOpen && (
        <NewPatientModal 
          onClose={() => setIsPatientModalOpen(false)}
          onSave={(newPatient) => {
            console.log("Saving patient:", newPatient);
            setIsPatientModalOpen(false);
            navigate('patients'); // Go to patients list to see the update
          }}
        />
      )}
    </div>
  );
}

export default App;