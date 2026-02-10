/**
 * Business Logic Tests - TasksRepository
 * Tests task management and filtering
 */
import { TasksRepository } from '../../src/repositories/TasksRepository';
import { TaskStatus } from '../../src/models/CaregiverTask';

describe('TasksRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new TasksRepository();
  });

  describe('all', () => {
    test('returns array of all tasks', () => {
      const tasks = repository.all();

      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeGreaterThan(0);
    });

    test('returns a copy of tasks array', () => {
      const tasks1 = repository.all();
      const tasks2 = repository.all();

      expect(tasks1).not.toBe(tasks2);
      expect(tasks1).toEqual(tasks2);
    });

    test('tasks have required properties', () => {
      const tasks = repository.all();
      const task = tasks[0];

      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('status');
      expect(task).toHaveProperty('priority');
    });
  });

  describe('pending', () => {
    test('returns only pending tasks', () => {
      const pendingTasks = repository.pending();

      expect(Array.isArray(pendingTasks)).toBe(true);
      pendingTasks.forEach(task => {
        expect(task.status).not.toBe(TaskStatus.completed);
      });
    });

    test('excludes completed tasks', () => {
      const pendingTasks = repository.pending();
      const allTasks = repository.all();
      const completedCount = allTasks.filter(t => t.status === TaskStatus.completed).length;

      expect(pendingTasks.length).toBeLessThan(allTasks.length);
      expect(pendingTasks.length).toBe(allTasks.length - completedCount);
    });
  });

  describe('completed', () => {
    test('returns only completed tasks', () => {
      const completedTasks = repository.completed();

      expect(Array.isArray(completedTasks)).toBe(true);
      completedTasks.forEach(task => {
        expect(task.status).toBe(TaskStatus.completed);
      });
    });

    test('completed tasks have completedAt date', () => {
      const completedTasks = repository.completed();

      completedTasks.forEach(task => {
        expect(task.completedAt).toBeTruthy();
        expect(task.completedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('overdue', () => {
    test('returns overdue tasks', () => {
      const overdueTasks = repository.overdue();

      expect(Array.isArray(overdueTasks)).toBe(true);
      overdueTasks.forEach(task => {
        expect(task.isOverdue).toBe(true);
      });
    });

    test('overdue tasks are not completed', () => {
      const overdueTasks = repository.overdue();

      overdueTasks.forEach(task => {
        expect(task.status).not.toBe(TaskStatus.completed);
      });
    });
  });

  describe('dueToday', () => {
    test('returns tasks due today', () => {
      const dueTodayTasks = repository.dueToday();

      expect(Array.isArray(dueTodayTasks)).toBe(true);
      dueTodayTasks.forEach(task => {
        expect(task.isDueToday).toBe(true);
      });
    });
  });

  describe('sortedByPriorityAndDate', () => {
    test('returns sorted array', () => {
      const sorted = repository.sortedByPriorityAndDate();

      expect(Array.isArray(sorted)).toBe(true);
      expect(sorted.length).toBeGreaterThan(0);
    });

    test('high priority tasks come before low priority', () => {
      const sorted = repository.sortedByPriorityAndDate();
      
      // Find first high and first low priority task
      const highIndex = sorted.findIndex(t => t.priority === 'high');
      const lowIndex = sorted.findIndex(t => t.priority === 'low');
      
      if (highIndex >= 0 && lowIndex >= 0) {
        expect(highIndex).toBeLessThan(lowIndex);
      }
    });

    test('only returns pending tasks', () => {
      const sorted = repository.sortedByPriorityAndDate();

      sorted.forEach(task => {
        expect(task.status).not.toBe(TaskStatus.completed);
      });
    });

    test('tasks with earlier due dates come first within same priority', () => {
      const sorted = repository.sortedByPriorityAndDate();
      
      // Check that within same priority, dates are ascending
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].priority === sorted[i + 1].priority) {
          const date1 = sorted[i].dueDate ? sorted[i].dueDate.getTime() : Infinity;
          const date2 = sorted[i + 1].dueDate ? sorted[i + 1].dueDate.getTime() : Infinity;
          expect(date1).toBeLessThanOrEqual(date2);
        }
      }
    });
  });

  describe('toggleStatus', () => {
    test('toggles pending task to completed', () => {
      const allTasks = repository.all();
      const pendingTask = allTasks.find(t => t.status === TaskStatus.pending);
      
      if (pendingTask) {
        const toggled = repository.toggleStatus(pendingTask.id);

        expect(toggled).not.toBeNull();
        expect(toggled.status).toBe(TaskStatus.completed);
        expect(toggled.completedAt).toBeInstanceOf(Date);
      }
    });

    test('toggles completed task to pending', () => {
      const allTasks = repository.all();
      const completedTask = allTasks.find(t => t.status === TaskStatus.completed);
      
      if (completedTask) {
        const toggled = repository.toggleStatus(completedTask.id);

        expect(toggled).not.toBeNull();
        expect(toggled.status).toBe(TaskStatus.pending);
        expect(toggled.completedAt).toBeNull();
      }
    });

    test('returns null for non-existent task', () => {
      const result = repository.toggleStatus('nonexistent-id');

      expect(result).toBeNull();
    });

    test('sets completedAt when completing task', () => {
      const allTasks = repository.all();
      const pendingTask = allTasks.find(t => t.status === TaskStatus.pending);
      
      if (pendingTask) {
        const beforeTime = Date.now();
        const toggled = repository.toggleStatus(pendingTask.id);
        const afterTime = Date.now();

        expect(toggled.completedAt).toBeInstanceOf(Date);
        expect(toggled.completedAt.getTime()).toBeGreaterThanOrEqual(beforeTime);
        expect(toggled.completedAt.getTime()).toBeLessThanOrEqual(afterTime);
      }
    });

    test('clears completedAt when uncompleting task', () => {
      const allTasks = repository.all();
      const completedTask = allTasks.find(t => t.status === TaskStatus.completed);
      
      if (completedTask) {
        const toggled = repository.toggleStatus(completedTask.id);

        expect(toggled.completedAt).toBeNull();
      }
    });
  });

  describe('priority system', () => {
    test('supports high, medium, and low priorities', () => {
      const tasks = repository.all();
      const priorities = new Set(tasks.map(t => t.priority));

      expect(priorities.has('high')).toBe(true);
      expect(priorities.has('medium')).toBe(true);
      expect(priorities.has('low')).toBe(true);
    });
  });
});
