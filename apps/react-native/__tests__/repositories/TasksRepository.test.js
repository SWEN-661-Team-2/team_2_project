import tasksRepository from '../../src/repositories/TasksRepository';
import { TaskStatus } from '../../src/models/CaregiverTask';

describe('TasksRepository', () => {
  
  describe('Basic Retrieval', () => {
    test('all() returns all tasks in a new array', () => {
      const allTasks = tasksRepository.all();
      expect(Array.isArray(allTasks)).toBe(true);
      expect(allTasks.length).toBe(5);
      // Verify it's a copy, not the original reference
      expect(allTasks).not.toBe(tasksRepository._tasks);
    });

    test('pending() returns only non-completed tasks', () => {
      const pending = tasksRepository.pending();
      expect(pending.every(t => t.status !== TaskStatus.completed)).toBe(true);
    });

    test('completed() returns only completed tasks', () => {
      const completed = tasksRepository.completed();
      expect(completed.every(t => t.status === TaskStatus.completed)).toBe(true);
    });
  });

  describe('Date Filtering', () => {
    test('overdue() filters tasks using model isOverdue getter', () => {
      const overdue = tasksRepository.overdue();
      expect(Array.isArray(overdue)).toBe(true);
    });

    test('dueToday() filters tasks using model isDueToday getter', () => {
      const dueToday = tasksRepository.dueToday();
      expect(Array.isArray(dueToday)).toBe(true);
    });
  });

  describe('Sorting Logic', () => {
    test('sortedByPriorityAndDate() returns high priority before low', () => {
      const sorted = tasksRepository.sortedByPriorityAndDate();
      
      // Find index of a high and a low priority task in the sorted list
      const highIdx = sorted.findIndex(t => t.priority === 'high');
      const lowIdx = sorted.findIndex(t => t.priority === 'low');
      
      if (highIdx !== -1 && lowIdx !== -1) {
        expect(highIdx).toBeLessThan(lowIdx);
      }
    });

    test('handles priority fallback to 0 for unknown priorities', () => {
      // Temporarily inject a task with weird priority to hit the "|| 0" branch
      tasksRepository._tasks.push({ 
        id: '99', 
        priority: 'none', 
        status: TaskStatus.pending,
        dueDate: new Date() 
      });
      
      const sorted = tasksRepository.sortedByPriorityAndDate();
      const unknownTask = sorted.find(t => t.id === '99');
      expect(unknownTask).toBeDefined();
      
      // Clean up for other tests
      tasksRepository._tasks = tasksRepository._tasks.filter(t => t.id !== '99');
    });
  });

  describe('toggleStatus()', () => {
    test('switches pending to completed and sets completedAt', () => {
      // Find a pending task (ID 1)
      const task = tasksRepository.toggleStatus('1');
      expect(task.status).toBe(TaskStatus.completed);
      expect(task.completedAt).toBeInstanceOf(Date);
    });

    test('switches completed to pending and clears completedAt', () => {
      // Task 1 is now completed from the previous test
      const task = tasksRepository.toggleStatus('1');
      expect(task.status).toBe(TaskStatus.pending);
      expect(task.completedAt).toBeNull();
    });

    test('returns null if taskId is not found', () => {
      const result = tasksRepository.toggleStatus('999');
      expect(result).toBeNull();
    });
  });
});