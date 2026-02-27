import React, { useState } from 'react';

import NewAppointmentModal from './NewAppointmentModal';
import NewTaskModal from './NewTaskModal';

const URGENT_TASKS = [
  { id: 1, name: 'John Davis', priority: 'high', task: 'Medication Administration', time: '2:00 PM' },
  { id: 2, name: 'Mary Wilson', priority: 'medium', task: 'Vital Signs Check', time: '2:30 PM' },
  { id: 3, name: 'Robert Brown', priority: 'high', task: 'Wound Care', time: '3:00 PM' },
];

const SCHEDULE_ITEMS = [
  { time: '2:00 PM', title: 'Medication Round – Floor 3' },
  { time: '3:30 PM', title: 'Patient Assessment – Room 302' },
  { time: '4:00 PM', title: 'Team Meeting' },
];

const RECENT_ACTIVITY = [
  { text: 'Completed medication administration for John Davis', ago: '10 min ago' },
  { text: 'Updated care plan for Mary Wilson', ago: '25 min ago' },
  { text: 'Scheduled appointment for Robert Brown', ago: '1 hr ago' },
];



function Dashboard({ onNavigate }) {
  const [noteText, setNoteText] = useState('');
  const [toast, setToast] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);


  const handleSaveTask = (taskData) => {
    console.log('New Task Saved:', taskData);
    showToast('Task created successfully!');
    setShowTaskModal(false);
  };


  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  return (
    <div className="page-content">
      <div className="toolbar" role="toolbar" aria-label="Quick actions">
        <button className="btn toolbar-btn" onClick={() => setShowTaskModal(true)}>+ New Task</button>
        <button className="btn toolbar-btn" onClick={() => setShowAppointmentModal(true)}>📅 New Appointment</button>
        <button className="btn toolbar-btn" onClick={() => onNavigate('patients')}>👤 New Patient</button>
        <button className="btn toolbar-btn" onClick={() => showToast('Saved!')}>💾 Save</button>
        <span className="toolbar-spacer"></span>
        <input
          className="input toolbar-search"
          type="search"
          placeholder="Quick search (Cmd+K)"
          aria-label="Quick search"
          data-search
        />
      </div>

      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back, Sarah. Here's your overview for today.</p>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Active Tasks</div>
          <div className="summary-number">12</div>
          <div className="summary-sub">8 completed today</div>
        </div>
        <div className="summary-card urgent">
          <div className="summary-label">Urgent Tasks</div>
          <div className="summary-number">3</div>
          <div className="summary-sub">Require immediate attention</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Today's Appointments</div>
          <div className="summary-number">5</div>
          <div className="summary-sub">Next: 2:00 PM</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Patients Assigned</div>
          <div className="summary-number">28</div>
          <div className="summary-sub">+3 new this week</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2 className="card-title">🚨 Urgent Tasks</h2>
          <p className="card-subtitle">Tasks requiring immediate attention</p>
          <ul className="task-list" role="list">
            {URGENT_TASKS.map(t => (
              <li key={t.id} className="task-item">
                <div className="task-info">
                  <strong>{t.name}</strong>
                  <span className={`priority-badge priority-${t.priority}`}>{t.priority}</span>
                  <div className="task-meta">{t.task}</div>
                </div>
                <div className="task-actions">
                  <span className="task-time">⏰ {t.time}</span>
                  <button
                    className="btn btn-sm primary"
                    onClick={() => showToast(`Started task for ${t.name}`)}
                  >
                    Start
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="card-title">📅 Today's Schedule</h2>
          <p className="card-subtitle">Upcoming events</p>
          <ul className="schedule-list" role="list">
            {SCHEDULE_ITEMS.map((s, i) => (
              <li key={i} className="schedule-item">
                <span className="schedule-time">{s.time}</span>
                <span className="schedule-title">{s.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="card-title">📝 Care Log Note</h2>
          <div className="field">
            <label className="label" htmlFor="dashboard-note">Note</label>
            <textarea
              id="dashboard-note"
              className="input"
              rows="3"
              placeholder="Type note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              aria-label="Care log note"
            />
          </div>
          <div className="btn-group">
            <button className="btn primary" onClick={() => showToast('Note saved!')}>Save Changes</button>
            <button className="btn" onClick={() => showToast('Issue marked resolved.')}>Mark Resolved</button>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">⚡ Recent Activity</h2>
          <p className="card-subtitle">Your recent actions and updates</p>
          <ul className="activity-list" role="list">
            {RECENT_ACTIVITY.map((a, i) => (
              <li key={i} className="activity-item">
                <span className="activity-dot" aria-hidden="true">●</span>
                <div className="activity-text">
                  <span>{a.text}</span>
                  <span className="activity-time">{a.ago}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showAppointmentModal && (
        <NewAppointmentModal
          onClose={() => setShowAppointmentModal(false)}
          onSave={(data) => {
            console.log('Appointment saved:', data);
            showToast('Appointment created!');
            setShowAppointmentModal(false);
          }}
        />
      )}

      {showTaskModal && (
        <NewTaskModal
          onClose={() => setShowTaskModal(false)}
          onSave={handleSaveTask}
        />
      )}


      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}


    </div>




  );
}

export default Dashboard;