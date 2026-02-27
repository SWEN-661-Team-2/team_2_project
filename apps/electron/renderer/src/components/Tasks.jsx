import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';    // Added useLocation


const INITIAL_TASKS = [
  { id: 1, title: 'Medication Administration', patient: 'John Davis', time: '2:00 PM', priority: 'high', category: 'Medication', status: 'pending' },
  { id: 2, title: 'Vital Signs Check', patient: 'Mary Wilson', time: '2:30 PM', priority: 'medium', category: 'Assessment', status: 'in-progress' },
  { id: 3, title: 'Wound Care', patient: 'Robert Brown', time: '3:00 PM', priority: 'high', category: 'Treatment', status: 'pending' },
  { id: 4, title: 'Patient Education', patient: 'Lisa Anderson', time: '4:30 PM', priority: 'low', category: 'Education', status: 'pending' },
  { id: 5, title: 'Documentation Review', patient: 'James Miller', time: '1:00 PM', priority: 'medium', category: 'Documentation', status: 'completed' },
];

const TASK_FILTERS = ['All Tasks', 'Pending', 'In Progress', 'Completed'];

function Tasks() {
  const location = useLocation();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState('All Tasks');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', category: 'Medication' });
  const [toast, setToast] = useState('');

useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openNew') === 'true') {
      setShowModal(true);
      
      // Clean up the URL so the modal doesn't pop up again if they refresh
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [location]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500); }

  const filtered = tasks.filter(t => {
    const matchFilter =
      filter === 'All Tasks' ||
      (filter === 'Pending' && t.status === 'pending') ||
      (filter === 'In Progress' && t.status === 'in-progress') ||
      (filter === 'Completed' && t.status === 'completed');
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.patient.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  function createTask() {
    if (!newTask.title.trim()) return;
    setTasks(prev => [
      { id: Date.now(), ...newTask, patient: 'Unassigned', time: '--:--', status: 'pending' },
      ...prev,
    ]);
    setNewTask({ title: '', priority: 'medium', category: 'Medication' });
    setShowModal(false);
    showToast('Task created successfully!');
  }

  const counts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="page-content">
      <div className="toolbar" role="toolbar" aria-label="Task actions">
        <h1 className="page-title" style={{ margin: 0 }}>Task Management</h1>
        <span className="toolbar-spacer"></span>
        <button className="btn primary" onClick={() => setShowModal(true)}>+ New Task</button>
      </div>
      <p className="page-subtitle">Manage and track your patient care tasks</p>

      <div className="card">
        <div className="filter-bar">
          <input
            className="input"
            type="search"
            placeholder="Search tasks or patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tasks"
            data-search
          />
          <div className="filter-tabs" role="tablist">
            {TASK_FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                role="tab"
                aria-selected={filter === f}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ul className="task-list" role="list">
          {filtered.length === 0 && <li className="empty-state">No tasks found.</li>}
          {filtered.map(task => (
            <li key={task.id} className="task-item task-item--full">
              <div className="task-check">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={(e) =>
                    setTasks(prev =>
                      prev.map(t =>
                        t.id === task.id
                          ? { ...t, status: e.target.checked ? 'completed' : 'pending' }
                          : t
                      )
                    )
                  }
                  aria-label={`Mark ${task.title} complete`}
                />
              </div>
              <div className="task-info">
                <div className="task-title-row">
                  <strong>{task.title}</strong>
                  <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                  <span className="category-badge">{task.category}</span>
                </div>
                <div className="task-meta">Patient: {task.patient} · {task.time}</div>
              </div>
              <div className="task-status">
                <span className={`status-badge status-${task.status}`}>
                  {task.status === 'in-progress'
                    ? 'In Progress'
                    : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="task-footer">
          <div className="task-count-grid">
            <div><div className="count-label">Total</div><div className="count-val">{counts.total}</div></div>
            <div><div className="count-label">Pending</div><div className="count-val">{counts.pending}</div></div>
            <div><div className="count-label">In Progress</div><div className="count-val">{counts.inProgress}</div></div>
            <div><div className="count-label">Completed</div><div className="count-val">{counts.completed}</div></div>
          </div>
        </div>
      </div>

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal">
            <div className="modal-header">
              <h2 id="modal-title">Create New Task</h2>
              <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">X</button>
            </div>
            <p className="modal-subtitle">Fields marked * are required.</p>
            <div className="field">
              <label className="label" htmlFor="task-title">Task Title *</label>
              <input
                className="input"
                id="task-title"
                type="text"
                placeholder="e.g., Administer morning medication"
                value={newTask.title}
                onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label className="label" htmlFor="task-priority">Priority</label>
                <select
                  className="input"
                  id="task-priority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask(p => ({ ...p, priority: e.target.value }))}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="field">
                <label className="label" htmlFor="task-category">Category</label>
                <select
                  className="input"
                  id="task-category"
                  value={newTask.category}
                  onChange={(e) => setNewTask(p => ({ ...p, category: e.target.value }))}
                >
                  <option>Medication</option>
                  <option>Assessment</option>
                  <option>Treatment</option>
                  <option>Education</option>
                  <option>Documentation</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn primary" onClick={createTask}>Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
