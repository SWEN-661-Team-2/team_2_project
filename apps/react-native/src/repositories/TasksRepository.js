import CaregiverTask, { TaskStatus } from '../models/CaregiverTask';

class TasksRepository {
  constructor() {
    this._tasks = [
      new CaregiverTask({ id: '1', title: 'Check patient vitals', status: TaskStatus.pending, priority: 'high', patient: 'John Doe', dueDate: new Date(Date.now() - 3600 * 1000).toISOString() }),
      new CaregiverTask({ id: '2', title: 'Update medication log', status: TaskStatus.completed, priority: 'medium', patient: 'Jane Smith', completedAt: new Date(Date.now() - 86400 * 1000).toISOString() }),
      new CaregiverTask({ id: '3', title: 'Schedule follow-up', status: TaskStatus.pending, priority: 'low', patient: 'Bob Johnson', dueDate: new Date(Date.now() + 86400 * 1000).toISOString() }),
      new CaregiverTask({ id: '4', title: 'Document consultation', status: TaskStatus.pending, priority: 'high', patient: 'Alice Williams', dueDate: new Date().toISOString() }),
      new CaregiverTask({ id: '5', title: 'Review test results', status: TaskStatus.completed, priority: 'medium', patient: 'Charlie Brown', completedAt: new Date().toISOString() }),
      new CaregiverTask({ id: '6', title: 'Confirm allergy list', status: TaskStatus.pending, priority: 'medium', patient: 'Diana Cross', dueDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString() }),
      new CaregiverTask({ id: '7', title: 'Call pharmacy for refill', status: TaskStatus.pending, priority: 'high', patient: 'Elena Drake', dueDate: new Date(Date.now() + 4 * 3600 * 1000).toISOString() }),
      new CaregiverTask({ id: '8', title: 'Update care plan notes', status: TaskStatus.pending, priority: 'low', patient: 'Amina Hassan', dueDate: new Date(Date.now() + 2 * 86400 * 1000).toISOString() }),
      new CaregiverTask({ id: '9', title: 'Upload lab results', status: TaskStatus.completed, priority: 'low', patient: 'Marcus Lee', completedAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString() }),
      new CaregiverTask({ id: '10', title: 'Verify insurance info', status: TaskStatus.pending, priority: 'medium', patient: 'Priya Patel', dueDate: new Date(Date.now() + 3 * 86400 * 1000).toISOString() }),
      new CaregiverTask({ id: '11', title: 'Assess fall risk', status: TaskStatus.pending, priority: 'high', patient: 'George King', dueDate: new Date(Date.now() - 5 * 3600 * 1000).toISOString() }),
      new CaregiverTask({ id: '12', title: 'Send appointment reminder', status: TaskStatus.pending, priority: 'low', patient: 'Sofia Rivera', dueDate: new Date(Date.now() + 6 * 3600 * 1000).toISOString() }),
      new CaregiverTask({ id: '13', title: 'Review caregiver notes', status: TaskStatus.completed, priority: 'medium', patient: 'Noah Carter', completedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString() }),
      new CaregiverTask({ id: '14', title: 'Check wound dressing status', status: TaskStatus.pending, priority: 'high', patient: 'Olivia Chen', dueDate: new Date(Date.now() + 1 * 86400 * 1000).toISOString() }),
      new CaregiverTask({ id: '15', title: 'Update emergency contacts', status: TaskStatus.pending, priority: 'medium', patient: 'Henry Adams', dueDate: new Date(Date.now() + 5 * 86400 * 1000).toISOString() }),
      new CaregiverTask({ id: '16', title: 'Document ADL progress', status: TaskStatus.pending, priority: 'low', patient: 'Mia Thompson', dueDate: new Date(Date.now() + 7 * 86400 * 1000).toISOString() }),
    ];
  }

  all() {
    return [...this._tasks];
  }

  pending() {
    return this._tasks.filter(t => t.status !== TaskStatus.completed);
  }

  completed() {
    return this._tasks.filter(t => t.status === TaskStatus.completed);
  }

  overdue() {
    return this._tasks.filter(t => t.isOverdue);
  }

  dueToday() {
    return this._tasks.filter(t => t.isDueToday);
  }

  sortedByPriorityAndDate() {
    const copy = this.pending();
    copy.sort((a, b) => {
      const pr = { high: 3, medium: 2, low: 1 };
      const pa = pr[a.priority] || 0;
      const pb = pr[b.priority] || 0;
      if (pa !== pb) return pb - pa; // high first
      const da = a.dueDate ? a.dueDate.getTime() : Infinity;
      const db = b.dueDate ? b.dueDate.getTime() : Infinity;
      return da - db;
    });
    return copy;
  }

  toggleStatus(taskId) {
    const idx = this._tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return null;
    const task = this._tasks[idx];
    task.status = task.status === TaskStatus.completed ? TaskStatus.pending : TaskStatus.completed;
    task.completedAt = task.status === TaskStatus.completed ? new Date() : null;
    return task;
  }
}

const instance = new TasksRepository();
export default instance;
