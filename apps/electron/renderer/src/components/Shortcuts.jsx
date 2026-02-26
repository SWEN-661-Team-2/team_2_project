import React from 'react';

const SHORTCUT_GROUPS = [
  {
    title: 'Navigation',
    shortcuts: [
      { action: 'Dashboard', keys: 'Cmd/Ctrl + 1' },
      { action: 'Tasks', keys: 'Cmd/Ctrl + 2' },
      { action: 'Schedule', keys: 'Cmd/Ctrl + 3' },
      { action: 'Patients', keys: 'Cmd/Ctrl + 4' },
      { action: 'Toggle Sidebar', keys: 'Cmd/Ctrl + B' },
      { action: 'Quick Search', keys: 'Cmd/Ctrl + K' },
    ],
  },
  {
    title: 'Quick Actions',
    shortcuts: [
      { action: 'New Task', keys: 'Cmd/Ctrl + N' },
      { action: 'New Appointment', keys: 'Cmd/Ctrl + Shift + N' },
      { action: 'New Patient', keys: 'Cmd/Ctrl + P' },
      { action: 'Export Data', keys: 'Cmd/Ctrl + E' },
      { action: 'Import Data', keys: 'Cmd/Ctrl + I' },
    ],
  },
  {
    title: 'Layout',
    shortcuts: [
      { action: 'Left-Handed Layout', keys: 'Cmd/Ctrl + Shift + L' },
      { action: 'Right-Handed Layout', keys: 'Cmd/Ctrl + Shift + R' },
      { action: 'Toggle Layout', keys: 'Cmd/Ctrl + Alt + L' },
      { action: 'Open Settings', keys: 'Cmd/Ctrl + ,' },
    ],
  },
  {
    title: 'Application',
    shortcuts: [
      { action: 'Keyboard Shortcuts', keys: 'Cmd/Ctrl + /' },
      { action: 'Reload App', keys: 'Cmd/Ctrl + R' },
      { action: 'Quit', keys: 'Cmd/Ctrl + Q' },
    ],
  },
];

function Shortcuts({ onBack }) {
  return (
    <div className="page-content">
      <h1 className="page-title">Keyboard Shortcuts</h1>
      <p className="page-subtitle">Complete reference for CareConnect keyboard shortcuts</p>

      <div className="shortcuts-grid">
        {SHORTCUT_GROUPS.map(group => (
          <div key={group.title} className="card">
            <h2 className="card-title">{group.title}</h2>
            <table className="shortcuts-table" aria-label={`${group.title} shortcuts`}>
              <thead>
                <tr>
                  <th scope="col">Action</th>
                  <th scope="col">Shortcut</th>
                </tr>
              </thead>
              <tbody>
                {group.shortcuts.map(s => (
                  <tr key={s.action}>
                    <td>{s.action}</td>
                    <td><kbd className="kbd">{s.keys}</kbd></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <button className="btn" onClick={onBack} style={{ marginTop: '16px' }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Shortcuts;
