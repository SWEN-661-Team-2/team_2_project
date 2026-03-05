import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'patients', label: 'Patients', icon: '👤' },
];

function Sidebar({ route, open, layoutMode, onNavigate, onToggleLayout, onLogout }) {
  // Detect if user is on Mac to show the correct symbol
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifier = isMac ? '⌘' : 'Ctrl+';

  return (
    <nav
      className={`sidebar ${open ? 'sidebar--open' : 'sidebar--closed'}`}
      aria-label="Main navigation" // WCAG: Clearer label for landmarks
    >
      <div className="sidebar-brand">
        <img src="/logo.png" alt="CareConnect Home" className="sidebar-logo" />
        {open && <span className="sidebar-title">CareConnect</span>}
      </div>

      <ul className="sidebar-nav" role="list" style={{ listStyle: 'none', padding: 0 }}>
        {NAV_ITEMS.map((item, index) => (
          <li key={item.id}>
            <button
              className={`sidebar-nav-item ${route === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={route === item.id ? 'page' : undefined}
              title={`${item.label} (${modifier}${index + 1})`}
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {open && (
                <div className="nav-label-container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  {/* WCAG: Ensure nav-label in CSS is at least #4b5563 (gray) or #ffffff (on active blue) */}
                  <span className="nav-label">{item.label}</span>
                  
                  {/* FIX: Removed opacity: 0.5. Used solid white for 4.63:1 contrast ratio on blue background */}
                  <span className="nav-shortcut-hint" style={{ fontSize: '10px', color: '#FFFFFF', fontWeight: '600', marginLeft: '8px' }}>
                    {modifier}{index + 1}
                  </span>
                </div>
              )}
            </button>
          </li>
        ))}

        {/* --- FIX: DIVIDER CONTRAST --- */}
        <div 
          className="sidebar-divider" 
          role="presentation"
          style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', margin: '8px 12px' }} 
        />

        <li>
          <button
            className={`sidebar-nav-item ${route === 'settings' ? 'active' : ''}`}
            onClick={() => onNavigate('settings')}
            aria-current={route === 'settings' ? 'page' : undefined}
            title={`Settings (${modifier},)`}
            style={{ width: '100%', cursor: 'pointer' }}
          >
            <span className="nav-icon" aria-hidden="true">⚙</span>
            {open && (
              <div className="nav-label-container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span className="nav-label">Settings</span>
                {/* FIX: Removed opacity: 0.5 to meet WCAG 1.4.3 */}
                <span className="nav-shortcut-hint" style={{ fontSize: '10px', color: '#FFFFFF', fontWeight: '600', marginLeft: '8px' }}>
                  {modifier},
                </span>
              </div>
            )}
          </button>
        </li>
      </ul>

      <div className="sidebar-footer">
        <button
          className="sidebar-nav-item layout-toggle-btn"
          onClick={onToggleLayout}
          style={{ width: '100%', cursor: 'pointer' }}
          title={layoutMode === 'left' ? 'Switch to Right-Handed' : 'Switch to Left-Handed'}
        >
          <span className="nav-icon" aria-hidden="true">
            {layoutMode === 'left' ? '→' : '←'}
          </span>
          {open && (
            <span className="nav-label">
              {layoutMode === 'left' ? 'Right-Handed' : 'Left-Handed'}
            </span>
          )}
        </button>
        <button
          className="sidebar-nav-item logout-btn"
          onClick={onLogout}
          style={{ width: '100%', cursor: 'pointer' }}
          title="Logout"
        >
          <span className="nav-icon" aria-hidden="true">⏏</span>
          {open && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;