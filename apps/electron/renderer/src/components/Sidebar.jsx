import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'patients', label: 'Patients', icon: '👤' },
];

function Sidebar({ route, open, layoutMode, onNavigate, onToggleLayout, onLogout }) {
  return (
    <nav
      className={`sidebar ${open ? 'sidebar--open' : 'sidebar--closed'}`}
      aria-label="Sidebar navigation"
    >
      <div className="sidebar-brand">
        <span className="sidebar-logo">🛡</span>
        {open && <span className="sidebar-title">CareConnect</span>}
      </div>

      <ul className="sidebar-nav" role="list">
        {NAV_ITEMS.map(item => (
          <li key={item.id}>
            <button
              className={`sidebar-nav-item ${route === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={route === item.id ? 'page' : undefined}
              title={item.label}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {open && <span className="nav-label">{item.label}</span>}
            </button>
          </li>
        ))}
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
