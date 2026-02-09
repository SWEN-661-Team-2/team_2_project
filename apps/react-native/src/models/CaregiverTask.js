export const TaskStatus = {
  pending: 'pending',
  inProgress: 'inProgress',
  completed: 'completed',
};

export default class CaregiverTask {
  constructor({ id, title, status = TaskStatus.pending, priority = 'medium', patient = '', dueDate = null, completedAt = null }) {
    this.id = String(id);
    this.title = title;
    this.status = status;
    this.priority = priority;
    this.patient = patient;
    // Ensure dueDate is always a Date object, not a string
    this.dueDate = dueDate ? (dueDate instanceof Date ? dueDate : new Date(dueDate)) : null;
    // Ensure completedAt is always a Date object, not a string
    this.completedAt = completedAt ? (completedAt instanceof Date ? completedAt : new Date(completedAt)) : null;
  }

  toJson() {
    return {
      id: this.id,
      title: this.title,
      status: this.status,
      priority: this.priority,
      patient: this.patient,
      dueDate: this.dueDate ? this.dueDate.toISOString() : null,
      completedAt: this.completedAt ? this.completedAt.toISOString() : null,
    };
  }

  static fromJson(raw) {
    return new CaregiverTask({
      id: raw.id,
      title: raw.title,
      status: raw.status,
      priority: raw.priority,
      patient: raw.patient,
      dueDate: raw.dueDate ? new Date(raw.dueDate) : null,
      completedAt: raw.completedAt ? new Date(raw.completedAt) : null,
    });
  }

  get isOverdue() {
    if (this.status === TaskStatus.completed) return false;
    if (!this.dueDate) return false;
    return Date.now() > this.dueDate.getTime();
  }

  get isDueToday() {
    if (!this.dueDate) return false;
    const d = new Date();
    return (
      d.getFullYear() === this.dueDate.getFullYear() &&
      d.getMonth() === this.dueDate.getMonth() &&
      d.getDate() === this.dueDate.getDate()
    );
  }
}
