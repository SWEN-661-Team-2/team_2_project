/**
 * @jest-environment jsdom
 * Tests for Tasks component logic
 */
import React from 'react';
import '@testing-library/jest-dom';

describe('Tasks Component Logic', () => {
  const TASKS = [
    { id: 1, title: 'Medication Administration', patient: 'John Davis', priority: 'high', status: 'pending', category: 'Medication' },
    { id: 2, title: 'Vital Signs Check', patient: 'Mary Wilson', priority: 'medium', status: 'in-progress', category: 'Assessment' },
    { id: 3, title: 'Wound Care', patient: 'Robert Brown', priority: 'high', status: 'pending', category: 'Treatment' },
    { id: 4, title: 'Patient Education', patient: 'Lisa Anderson', priority: 'low', status: 'completed', category: 'Education' },
    { id: 5, title: 'Documentation Review', patient: 'James Miller', priority: 'medium', status: 'completed', category: 'Documentation' }
  ];

  describe('Task filtering', () => {
    function filterTasks(tasks, filter, search = '') {
      return tasks.filter(t => {
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
    }

    test('All Tasks filter returns all tasks', () => {
      const result = filterTasks(TASKS, 'All Tasks');
      expect(result).toHaveLength(5);
    });

    test('Pending filter returns only pending tasks', () => {
      const result = filterTasks(TASKS, 'Pending');
      expect(result).toHaveLength(2);
      result.forEach(t => expect(t.status).toBe('pending'));
    });

    test('In Progress filter returns only in-progress tasks', () => {
      const result = filterTasks(TASKS, 'In Progress');
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('in-progress');
    });

    test('Completed filter returns only completed tasks', () => {
      const result = filterTasks(TASKS, 'Completed');
      expect(result).toHaveLength(2);
      result.forEach(t => expect(t.status).toBe('completed'));
    });

    test('Search by title filters correctly', () => {
      const result = filterTasks(TASKS, 'All Tasks', 'medication');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Medication Administration');
    });

    test('Search by patient name filters correctly', () => {
      const result = filterTasks(TASKS, 'All Tasks', 'john');
      expect(result).toHaveLength(1);
      expect(result[0].patient).toBe('John Davis');
    });

    test('Search is case-insensitive', () => {
      const result = filterTasks(TASKS, 'All Tasks', 'MARY');
      expect(result).toHaveLength(1);
    });

    test('Empty search returns all tasks for current filter', () => {
      const result = filterTasks(TASKS, 'All Tasks', '');
      expect(result).toHaveLength(5);
    });

    test('Combined filter and search works correctly', () => {
      const result = filterTasks(TASKS, 'Pending', 'john');
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('pending');
    });

    test('Search with no match returns empty array', () => {
      const result = filterTasks(TASKS, 'All Tasks', 'nonexistent patient xyz');
      expect(result).toHaveLength(0);
    });
  });

  describe('Task status update', () => {
    function updateTaskStatus(tasks, id, status) {
      return tasks.map(t => t.id === id ? { ...t, status } : t);
    }

    test('updates task status correctly', () => {
      const updated = updateTaskStatus(TASKS, 1, 'completed');
      const task = updated.find(t => t.id === 1);
      expect(task.status).toBe('completed');
    });

    test('does not modify other tasks', () => {
      const updated = updateTaskStatus(TASKS, 1, 'completed');
      const otherTask = updated.find(t => t.id === 2);
      expect(otherTask.status).toBe('in-progress');
    });

    test('returns same length array', () => {
      const updated = updateTaskStatus(TASKS, 1, 'completed');
      expect(updated).toHaveLength(TASKS.length);
    });
  });

  describe('Task creation', () => {
    function createTask(tasks, newTask) {
      if (!newTask.title.trim()) return tasks;
      const task = {
        id: Date.now(),
        ...newTask,
        patient: 'Unassigned',
        time: '--:--',
        status: 'pending'
      };
      return [task, ...tasks];
    }

    test('adds new task to beginning of list', () => {
      const newTask = { title: 'New Task', priority: 'medium', category: 'Medication' };
      const updated = createTask(TASKS, newTask);
      expect(updated).toHaveLength(6);
      expect(updated[0].title).toBe('New Task');
    });

    test('ignores empty title', () => {
      const newTask = { title: '   ', priority: 'medium', category: 'Medication' };
      const updated = createTask(TASKS, newTask);
      expect(updated).toHaveLength(5);
    });

    test('new task starts with pending status', () => {
      const newTask = { title: 'Test Task', priority: 'high', category: 'Treatment' };
      const updated = createTask(TASKS, newTask);
      expect(updated[0].status).toBe('pending');
    });

    test('preserves priority on new task', () => {
      const newTask = { title: 'Urgent Task', priority: 'high', category: 'Medication' };
      const updated = createTask(TASKS, newTask);
      expect(updated[0].priority).toBe('high');
    });
  });

  describe('Task count summary', () => {
    function getTaskCounts(tasks) {
      return {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length
      };
    }

    test('counts total tasks', () => {
      expect(getTaskCounts(TASKS).total).toBe(5);
    });

    test('counts pending tasks', () => {
      expect(getTaskCounts(TASKS).pending).toBe(2);
    });

    test('counts in-progress tasks', () => {
      expect(getTaskCounts(TASKS).inProgress).toBe(1);
    });

    test('counts completed tasks', () => {
      expect(getTaskCounts(TASKS).completed).toBe(2);
    });

    test('counts sum to total', () => {
      const counts = getTaskCounts(TASKS);
      expect(counts.pending + counts.inProgress + counts.completed).toBe(counts.total);
    });
  });
});
