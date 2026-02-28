import React, { useState } from 'react';

function NewTaskModal({ onClose, onSave }) {
    // Local state for the form
    const [task, setTask] = useState({
        title: '',
        priority: 'medium',
        category: 'Medication'
    });

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="task-title">
            <div className="modal">
                <div className="modal-header">
                    <h2 id="task-title">Create New Task</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close modal">X</button>
                </div>

                <div className="modal-body" style={{ padding: '20px 0' }}>
                    <div className="field">
                        <label className="label">Task Title *</label>
                        <input
                            id="task-name"
                            className="input"
                            type="text"
                            autoFocus
                            value={task.title}
                            onChange={(e) => setTask({ ...task, title: e.target.value })}
                            placeholder="Enter task name..."
                        />
                    </div>
                    <div className="field-row" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <div className="field" style={{ flex: 1 }}>
                            {/* Added htmlFor linking to the select id */}
                            <label className="label" htmlFor="task-priority">Priority</label>
                            <select
                                id="task-priority"
                                className="input"
                                value={task.priority}
                                onChange={(e) => setTask({ ...task, priority: e.target.value })}
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div className="field" style={{ flex: 1 }}>
                            {/* Added htmlFor linking to the select id */}
                            <label className="label" htmlFor="task-category">Category</label>
                            <select
                                id="task-category"
                                className="input"
                                value={task.category}
                                onChange={(e) => setTask({ ...task, category: e.target.value })}
                            >
                                <option value="Medication">Medication</option>
                                <option value="Assessment">Assessment</option>
                                <option value="Treatment">Treatment</option>
                            </select>
                        </div>
                    </div>

                    {/* <div className="field-row" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <div className="field" style={{ flex: 1 }}>
                            <label className="label">Priority</label>
                            <select
                                className="input"
                                value={task.priority}
                                onChange={(e) => setTask({ ...task, priority: e.target.value })}
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div className="field" style={{ flex: 1 }}>
                            <label className="label">Category</label>
                            <select
                                className="input"
                                value={task.category}
                                onChange={(e) => setTask({ ...task, category: e.target.value })}
                            >
                                <option>Medication</option>
                                <option>Assessment</option>
                                <option>Treatment</option>
                            </select>
                        </div>
                    </div> */}
                </div>

                <div className="modal-footer">
                    <button className="btn" onClick={onClose} aria-label="Close modal">Cancel</button>
                    <button
                        className="btn primary"
                        onClick={() => {
                            if (!task.title) return;
                            onSave(task);
                        }}
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewTaskModal;