import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'patients', label: 'Patients', icon: '👤' },
];

function Sidebar({ route, open, layoutMode, onNavigate, onToggleLayout, onLogout }) {
  const isMac = navigator.userAgentData
    ? navigator.userAgentData.platform.toUpperCase().includes('MAC')
    : navigator.userAgent.toUpperCase().includes('MAC');
  const modifier = isMac ? '⌘' : 'Ctrl+';

  return (
    <nav
      className={`sidebar ${open ? 'sidebar--open' : 'sidebar--closed'}`}
      aria-label="Sidebar navigation"
    >
      <div className="sidebar-brand">
        <img src="/logo.png" alt="CareConnect" className="sidebar-logo" />
        {open && <span className="sidebar-title">CareConnect</span>}
      </div>

      <ul className="sidebar-nav">
        {NAV_ITEMS.map((item, index) => (
          <li key={item.id}>
            <button
              className={`sidebar-nav-item ${route === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={route === item.id ? 'page' : undefined}
              title={`${item.label} (${modifier}${index + 1})`}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {open && (
                <div className="nav-label-container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-shortcut-hint">
                    {modifier}{index + 1}
                  </span>
                </div>
              )}
            </button>
          </li>
        ))}

        <div className="sidebar-divider" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '8px 12px' }} />
        <li>
          <button
            className={`sidebar-nav-item ${route === 'settings' ? 'active' : ''}`}
            onClick={() => onNavigate('settings')}
            aria-current={route === 'settings' ? 'page' : undefined}
            title={`Settings (${modifier},)`}
          >
            <span className="nav-icon" aria-hidden="true">⚙</span>
            {open && (
              <div className="nav-label-container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span className="nav-label">Settings</span>
                <span className="nav-shortcut-hint">
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
