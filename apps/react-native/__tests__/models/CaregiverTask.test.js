/**
 * Business Logic Tests - CaregiverTask Model
 * Tests the CaregiverTask class and TaskStatus enum
 */
import CaregiverTask, { TaskStatus } from '../../src/models/CaregiverTask';

describe('CaregiverTask Model', () => {
  describe('constructor', () => {
    test('creates task with all fields', () => {
      const dueDate = new Date('2024-03-20T10:00:00');
      const task = new CaregiverTask({
        id: '1',
        title: 'Check vitals',
        status: TaskStatus.pending,
        priority: 'high',
        patient: 'John Doe',
        dueDate: dueDate,
      });

      expect(task.id).toBe('1');
      expect(task.title).toBe('Check vitals');
      expect(task.status).toBe(TaskStatus.pending);
      expect(task.priority).toBe('high');
      expect(task.patient).toBe('John Doe');
      expect(task.dueDate).toEqual(dueDate);
      expect(task.completedAt).toBeNull();
    });

    test('creates task with default values', () => {
      const task = new CaregiverTask({
        id: '2',
        title: 'Review notes',
      });

      expect(task.status).toBe(TaskStatus.pending);
      expect(task.priority).toBe('medium');
      expect(task.patient).toBe('');
      expect(task.dueDate).toBeNull();
      expect(task.completedAt).toBeNull();
    });

    test('converts string date to Date object', () => {
      const task = new CaregiverTask({
        id: '3',
        title: 'Task',
        dueDate: '2024-03-15T12:00:00Z',
      });

      expect(task.dueDate).toBeInstanceOf(Date);
    });

    test('converts completedAt string to Date object', () => {
      const task = new CaregiverTask({
        id: '4',
        title: 'Task',
        completedAt: '2024-03-15T12:00:00Z',
      });

      expect(task.completedAt).toBeInstanceOf(Date);
    });

    test('converts id to string', () => {
      const task = new CaregiverTask({
        id: 123,
        title: 'Task',
      });

      expect(task.id).toBe('123');
      expect(typeof task.id).toBe('string');
    });
  });

  describe('TaskStatus enum', () => {
    test('contains all status values', () => {
      expect(TaskStatus.pending).toBe('pending');
      expect(TaskStatus.inProgress).toBe('inProgress');
      expect(TaskStatus.completed).toBe('completed');
    });
  });

  describe('toJson', () => {
    test('serializes task to JSON', () => {
      const dueDate = new Date('2024-03-20T10:00:00Z');
      const task = new CaregiverTask({
        id: '1',
        title: 'Task',
        status: TaskStatus.completed,
        priority: 'high',
        patient: 'Patient',
        dueDate: dueDate,
        completedAt: dueDate,
      });

      const json = task.toJson();

      expect(json.id).toBe('1');
      expect(json.title).toBe('Task');
      expect(json.status).toBe(TaskStatus.completed);
      expect(json.priority).toBe('high');
      expect(json.patient).toBe('Patient');
      expect(json.dueDate).toBe(dueDate.toISOString());
      expect(json.completedAt).toBe(dueDate.toISOString());
    });

    test('handles null dates in serialization', () => {
      const task = new CaregiverTask({
        id: '2',
        title: 'Task',
      });

      const json = task.toJson();

      expect(json.dueDate).toBeNull();
      expect(json.completedAt).toBeNull();
    });
  });

  describe('fromJson', () => {
    test('creates task from JSON', () => {
      const json = {
        id: '1',
        title: 'Task',
        status: TaskStatus.pending,
        priority: 'low',
        patient: 'Patient',
        dueDate: '2024-03-20T10:00:00Z',
        completedAt: null,
      };

      const task = CaregiverTask.fromJson(json);

      expect(task.id).toBe('1');
      expect(task.title).toBe('Task');
      expect(task.status).toBe(TaskStatus.pending);
      expect(task.priority).toBe('low');
      expect(task.patient).toBe('Patient');
      expect(task.dueDate).toBeInstanceOf(Date);
      expect(task.completedAt).toBeNull();
    });

    test('handles null dates in deserialization', () => {
      const json = {
        id: '2',
        title: 'Task',
        status: TaskStatus.pending,
        priority: 'medium',
        patient: '',
        dueDate: null,
        completedAt: null,
      };

      const task = CaregiverTask.fromJson(json);

      expect(task.dueDate).toBeNull();
      expect(task.completedAt).toBeNull();
    });
  });

  describe('isOverdue', () => {
    test('returns true for overdue pending tasks', () => {
      const pastDate = new Date(Date.now() - 86400 * 1000); // Yesterday
      const task = new CaregiverTask({
        id: '1',
        title: 'Overdue task',
        status: TaskStatus.pending,
        dueDate: pastDate,
      });

      expect(task.isOverdue).toBe(true);
    });

    test('returns false for completed tasks even if past due', () => {
      const pastDate = new Date(Date.now() - 86400 * 1000);
      const task = new CaregiverTask({
        id: '2',
        title: 'Completed task',
        status: TaskStatus.completed,
        dueDate: pastDate,
      });

      expect(task.isOverdue).toBe(false);
    });

    test('returns false for tasks without due date', () => {
      const task = new CaregiverTask({
        id: '3',
        title: 'No due date',
        status: TaskStatus.pending,
      });

      expect(task.isOverdue).toBe(false);
    });

    test('returns false for future tasks', () => {
      const futureDate = new Date(Date.now() + 86400 * 1000); // Tomorrow
      const task = new CaregiverTask({
        id: '4',
        title: 'Future task',
        status: TaskStatus.pending,
        dueDate: futureDate,
      });

      expect(task.isOverdue).toBe(false);
    });
  });

  describe('isDueToday', () => {
    test('returns true for tasks due today', () => {
      const today = new Date();
      const task = new CaregiverTask({
        id: '1',
        title: 'Today task',
        dueDate: today,
      });

      expect(task.isDueToday).toBe(true);
    });

    test('returns false for tasks without due date', () => {
      const task = new CaregiverTask({
        id: '2',
        title: 'No due date',
      });

      expect(task.isDueToday).toBe(false);
    });

    test('returns false for past tasks', () => {
      const yesterday = new Date(Date.now() - 86400 * 1000);
      const task = new CaregiverTask({
        id: '3',
        title: 'Past task',
        dueDate: yesterday,
      });

      expect(task.isDueToday).toBe(false);
    });

    test('returns false for future tasks', () => {
      const tomorrow = new Date(Date.now() + 86400 * 1000);
      const task = new CaregiverTask({
        id: '4',
        title: 'Future task',
        dueDate: tomorrow,
      });

      expect(task.isDueToday).toBe(false);
    });
  });

  describe('round-trip serialization', () => {
    test('preserves all data through JSON conversion', () => {
      const original = new CaregiverTask({
        id: '1',
        title: 'Test Task',
        status: TaskStatus.inProgress,
        priority: 'high',
        patient: 'John Doe',
        dueDate: new Date('2024-03-20T10:00:00Z'),
        completedAt: new Date('2024-03-19T15:30:00Z'),
      });

      const json = original.toJson();
      const restored = CaregiverTask.fromJson(json);

      expect(restored.id).toBe(original.id);
      expect(restored.title).toBe(original.title);
      expect(restored.status).toBe(original.status);
      expect(restored.priority).toBe(original.priority);
      expect(restored.patient).toBe(original.patient);
      expect(restored.dueDate.getTime()).toBe(original.dueDate.getTime());
      expect(restored.completedAt.getTime()).toBe(original.completedAt.getTime());
    });
  });
});
