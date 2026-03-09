import React, { useState, useEffect } from 'react';
import NewTaskModal from './NewTaskModal';

const INITIAL_TASKS = [
  { id: 1, title: 'Medication Administration', patient: 'John Davis', time: '2:00 PM', priority: 'high', category: 'Medication', status: 'pending' },
  { id: 2, title: 'Vital Signs Check', patient: 'Mary Wilson', time: '2:30 PM', priority: 'medium', category: 'Assessment', status: 'in-progress' },
  { id: 3, title: 'Wound Care', patient: 'Robert Brown', time: '3:00 PM', priority: 'high', category: 'Treatment', status: 'pending' },
  { id: 4, title: 'Patient Education', patient: 'Lisa Anderson', time: '4:30 PM', priority: 'low', category: 'Education', status: 'pending' },
  { id: 5, title: 'Documentation Review', patient: 'James Miller', time: '1:00 PM', priority: 'medium', category: 'Documentation', status: 'completed' },
];

const TASK_FILTERS = ['All Tasks', 'Pending', 'In Progress', 'Completed'];

function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState('All Tasks');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const searchString = globalThis.location.hash.includes('?')
      ? globalThis.location.hash.split('?')[1]
      : globalThis.location.search;

    const params = new URLSearchParams(searchString);

    if (params.get('openNew') === 'true') {
      setShowModal(true);
      const cleanUrl = globalThis.location.href.split('?')[0];
      globalThis.history?.replaceState?.({}, '', cleanUrl);
    }
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  const handleSaveTask = (taskData) => {
    setTasks(prev => [
      {
        id: Date.now(),
        ...taskData,
        patient: 'Unassigned',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'pending'
      },
      ...prev,
    ]);
    setShowModal(false);
    showToast('Task created successfully!');
  };

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

  return (
    <div className="page-content">
      <div className="toolbar" role="toolbar" aria-label="Task actions">
        <h1 className="page-title" style={{ margin: 0 }}>Task Management</h1>
        <span className="toolbar-spacer"></span>
        <button className="btn primary" onClick={() => setShowModal(true)}>+ New Task</button>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input
            className="input"
            type="search"
            aria-label="Search tasks" placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-tabs" role="tablist">
            {TASK_FILTERS.map(f => (
              <button
                key={f}
                id={`tab-${f}`}
                role="tab" // Fixes the "Child role" error
                aria-selected={filter === f} // Tells screen readers which tab is active
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

        <ul className="task-list">
          {filtered.map(task => (
            <li key={task.id} className="task-item task-item--full">
              <input
                type="checkbox"
                id={`task-${task.id}`}
                aria-label={`Mark ${task.title} as ${task.status === 'completed' ? 'pending' : 'completed'}`}
                checked={task.status === 'completed'}
                onChange={() => setTasks(prev => prev.map(t =>
                  t.id === task.id
                    ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
                    : t
                ))}
              />
              <div className="task-info">
                <label htmlFor={`task-${task.id}`}><strong>{task.title}</strong></label>
                <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                <div className="task-meta">Patient: {task.patient} · {task.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <NewTaskModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
        />
      )}

      {toast && <output className="toast">{toast}</output>}
    </div>
  );
}

export default Tasks;
