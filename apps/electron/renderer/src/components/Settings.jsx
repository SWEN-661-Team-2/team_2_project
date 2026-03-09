import React, { useState } from 'react';

const SETTINGS_TABS = ['General', 'Accessibility', 'Notifications'];

function Settings({ layoutMode, onSave, onBack }) {
  const [tab, setTab] = useState('General');
  const [layout, setLayout] = useState(layoutMode);
  const [zoom, setZoom] = useState('100%');
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [enhancedKb, setEnhancedKb] = useState(true);
  const [focusIndicators, setFocusIndicators] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [urgentAlerts, setUrgentAlerts] = useState(true);
  const [saved, setSaved] = useState('');

  async function handleSave() {
    await onSave(layout);
    setSaved('Settings saved.');
    setTimeout(() => setSaved(''), 2500);
  }

  return (
    <div className="page-content">
      <h1 className="page-title">Settings &amp; Preferences</h1>
      <p className="page-subtitle">Customize your CareConnect experience</p>

      <div className="card" style={{ maxWidth: '680px' }}>
        <div className="tab-bar" role="tablist">
          {SETTINGS_TABS.map(t => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
              role="tab"
              aria-selected={tab === t}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'General' && (
          <div>
            <div className="settings-section">
              <h2 className="settings-heading">Layout Preferences</h2>
              <div className="setting-row">
                <label htmlFor="left-handed-toggle">
                  <div className="setting-label">Left-Handed Mode</div>
                  <div className="setting-desc">Optimize layout for left-handed users</div>
                </label>
                <span className="toggle">
                  <input
                    id="left-handed-toggle"
                    type="checkbox"
                    checked={layout === 'left'}
                    aria-label="Mark task as completed"
                    onChange={(e) => setLayout(e.target.checked ? 'left' : 'right')}
                  />
                  <span className="toggle-track"></span>
                </span>
              </div>
            </div>
            <div className="settings-section">
              <h2 className="settings-heading">Appearance</h2>
              <div className="field">
                <label className="label" htmlFor="zoom-level">Default Zoom Level</label>
                <select className="input" id="zoom-level" value={zoom} onChange={(e) => setZoom(e.target.value)}>
                  <option>75%</option>
                  <option>90%</option>
                  <option>100%</option>
                  <option>110%</option>
                  <option>125%</option>
                  <option>150%</option>
                </select>
              </div>
            </div>
            <div className="settings-section">
              <h2 className="settings-heading">User Information</h2>
              <div className="field">
                <label className="label" htmlFor="user-name">Name</label>
                <input className="input" id="user-name" type="text" defaultValue="Sarah Johnson, RN" />
              </div>
              <div className="field">
                <label className="label" htmlFor="user-role">Role</label>
                <input className="input" id="user-role" type="text" defaultValue="Registered Nurse" />
              </div>
            </div>
          </div>
        )}

        {tab === 'Accessibility' && (
          <div>
            <div className="settings-section">
              <h2 className="settings-heading">Keyboard &amp; Navigation</h2>
              <div className="setting-row">
                <label htmlFor="enhanced-kb-toggle">
                  <div className="setting-label">Enhanced Keyboard Navigation</div>
                  <div className="setting-desc">Enable advanced keyboard shortcuts</div>
                </label>
                <span className="toggle">
                  <input
                    id="enhanced-kb-toggle"
                    type="checkbox"
                    checked={enhancedKb}
                    onChange={(e) => setEnhancedKb(e.target.checked)}
                  />
                  <span className="toggle-track"></span>
                </span>
              </div>
              <div className="setting-row">
                <label htmlFor="focus-indicators-toggle">
                  <div className="setting-label">Always Show Focus Indicators</div>
                  <div className="setting-desc">Visible focus rings for keyboard navigation</div>
                </label>
                <span className="toggle">
                  <input
                    id="focus-indicators-toggle"
                    type="checkbox"
                    checked={focusIndicators}
                    onChange={(e) => setFocusIndicators(e.target.checked)}
                  />
                  <span className="toggle-track"></span>
                </span>
              </div>
            </div>
            <div className="settings-section">
              <h2 className="settings-heading">Visual Accessibility</h2>
              <div className="setting-row">
                <label htmlFor="high-contrast-toggle">
                  <div className="setting-label">High Contrast Mode</div>
                  <div className="setting-desc">Increase contrast for better visibility</div>
                </label>
                <span className="toggle">
                  <input
                    id="high-contrast-toggle"
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                  />
                  <span className="toggle-track"></span>
                </span>
              </div>
              <div className="setting-row">
                <label htmlFor="reduce-motion-toggle">
                  <div className="setting-label">Reduce Motion</div>
                  <div className="setting-desc">Minimize animations and transitions</div>
                </label>
                <span className="toggle">
                  <input
                    id="reduce-motion-toggle"
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={(e) => setReduceMotion(e.target.checked)}
                  />
                  <span className="toggle-track"></span>
                </span>
              </div>
            </div>
          </div>
        )}

        {tab === 'Notifications' && (
          <div>
            <div className="settings-section">
              <h2 className="settings-heading">Task Notifications</h2>
              <div className="setting-row">
                <label htmlFor="task-reminders-toggle">
                  <div className="setting-label">Task Reminders</div>
                  <div className="setting-desc">Receive reminders for upcoming tasks</div>
                </label>
                <span className="toggle">
                  <input
                    id="task-reminders-toggle"
                    type="checkbox"
                    checked={taskReminders}
                    onChange={(e) => setTaskReminders(e.target.checked)}
                  />
                  <span className="toggle-track"></span>
                </span>
              </div>
              <div className="setting-row">
                <label htmlFor="urgent-alerts-toggle">
                  <div className="setting-label">Urgent Task Alerts</div>
                  <div className="setting-desc">Priority notifications for urgent tasks</div>
                </label>
                <span className="toggle">
                  <input
                    id="urgent-alerts-toggle"
                    type="checkbox"
                    checked={urgentAlerts}
                    onChange={(e) => setUrgentAlerts(e.target.checked)}
                  />
                  <span className="toggle-track"></span>
                </span>
              </div>
              <div className="field">
                <label className="label" htmlFor="reminder-lead">Reminder Lead Time</label>
                <select className="input" id="reminder-lead">
                  <option>5 minutes before</option>
                  <option>15 minutes before</option>
                  <option>30 minutes before</option>
                  <option>1 hour before</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px' }}>
          <button className="btn" onClick={onBack}>Cancel</button>
          <button className="btn primary" onClick={handleSave}>Save Changes</button>
        </div>

        {saved && <output className="toast" aria-live="polite">{saved}</output>}
      </div>
    </div>
  );
}

export default Settings;
