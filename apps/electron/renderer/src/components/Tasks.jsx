import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
import NewTaskModal from './NewTaskModal'; // Import your new component

const INITIAL_TASKS = [
  { id: 1, title: 'Medication Administration', patient: 'John Davis', time: '2:00 PM', priority: 'high', category: 'Medication', status: 'pending' },
  { id: 2, title: 'Vital Signs Check', patient: 'Mary Wilson', time: '2:30 PM', priority: 'medium', category: 'Assessment', status: 'in-progress' },
  { id: 3, title: 'Wound Care', patient: 'Robert Brown', time: '3:00 PM', priority: 'high', category: 'Treatment', status: 'pending' },
  { id: 4, title: 'Patient Education', patient: 'Lisa Anderson', time: '4:30 PM', priority: 'low', category: 'Education', status: 'pending' },
  { id: 5, title: 'Documentation Review', patient: 'James Miller', time: '1:00 PM', priority: 'medium', category: 'Documentation', status: 'completed' },
];

const TASK_FILTERS = ['All Tasks', 'Pending', 'In Progress', 'Completed'];

function Tasks() {
  // const location = useLocation();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState('All Tasks');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

useEffect(() => {
    // Standard JS works everywhere, even without a <Router>
    const searchString = window.location.hash.includes('?') 
                         ? window.location.hash.split('?')[1] 
                         : window.location.search;
    
    const params = new URLSearchParams(searchString);
    
    if (params.get('openNew') === 'true') {
      setShowModal(true);
      // Clean up the URL
      const cleanUrl = window.location.href.split('?')[0];
      window.history.replaceState({}, '', cleanUrl);
    }
}, []);

  function showToast(msg) { 
    setToast(msg); 
    setTimeout(() => setToast(''), 2500); 
  }

  // Handle saving task from the NEW modal component
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

      <div className="card">
        <div className="filter-bar">
          <input
            className="input"
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-tabs" role="tablist">
            {TASK_FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ul className="task-list">
          {filtered.map(task => (
            <li key={task.id} className="task-item task-item--full">
              <div className="task-info">
                <strong>{task.title}</strong>
                <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                <div className="task-meta">Patient: {task.patient} · {task.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* NEW MODAL PATTERN */}
      {showModal && (
        <NewTaskModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

export default Tasks;