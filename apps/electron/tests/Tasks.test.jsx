/**
 * @jest-environment jsdom
 */
// Tests for Tasks component logic

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tasks from '../renderer/src/components/Tasks';

describe('Tasks Component Logic', () => {
  const TASKS = [
    { id: 1, title: 'Medication Administration', patient: 'John Davis', priority: 'high', status: 'pending', category: 'Medication' },
    { id: 2, title: 'Vital Signs Check', patient: 'Mary Wilson', priority: 'medium', status: 'in-progress', category: 'Assessment' },
    { id: 3, title: 'Wound Care', patient: 'Robert Brown', priority: 'high', status: 'pending', category: 'Treatment' },
    { id: 4, title: 'Patient Education', patient: 'Lisa Anderson', priority: 'low', status: 'completed', category: 'Education' },
    { id: 5, title: 'Documentation Review', patient: 'James Miller', priority: 'medium', status: 'completed', category: 'Documentation' }
  ];

  describe('Rendering', () => {
    test('renders Task Management heading', () => {
      render(<Tasks />);
      expect(screen.getByText('Task Management')).toBeInTheDocument();
    });

    test('renders New Task button', () => {
      render(<Tasks />);
      expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument();
    });

    test('renders task list with items', () => {
      render(<Tasks />);
      expect(screen.getByText('Medication Administration')).toBeInTheDocument();
    });

    test('clicking New Task opens modal', () => {
      render(<Tasks />);
      fireEvent.click(screen.getByRole('button', { name: /new task/i }));
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });

    test('search input filters tasks', () => {
      render(<Tasks />);
      const searchInput = screen.getByLabelText(/search tasks/i);
      fireEvent.change(searchInput, { target: { value: 'Wound' } });
      expect(screen.getByText('Wound Care')).toBeInTheDocument();
      expect(screen.queryByText('Medication Administration')).not.toBeInTheDocument();
    });

    test('clicking filter tabs updates view', () => {
      render(<Tasks />);
      fireEvent.click(screen.getByRole('tab', { name: /completed/i }));
      expect(screen.getByText('Documentation Review')).toBeInTheDocument();
      expect(screen.queryByText('Medication Administration')).not.toBeInTheDocument();
    });

    test('submitting modal with title creates task and shows toast', () => {
      render(<Tasks />);
      fireEvent.click(screen.getByRole('button', { name: /new task/i }));
      fireEvent.change(screen.getByLabelText(/task title/i), { target: { value: 'Brand New Task' } });
      fireEvent.click(screen.getByRole('button', { name: /create task/i }));
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Task filtering logic', () => {
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

    test('filters correctly by status and search term', () => {
      const pendingJohn = filterTasks(TASKS, 'Pending', 'john');
      expect(pendingJohn).toHaveLength(1);
      expect(pendingJohn[0].status).toBe('pending');
      expect(pendingJohn[0].patient).toBe('John Davis');
    });

    test('Search is case-insensitive', () => {
      const result = filterTasks(TASKS, 'All Tasks', 'MARY');
      expect(result).toHaveLength(1);
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

    test('calculates correct task distribution', () => {
      const counts = getTaskCounts(TASKS);
      expect(counts.total).toBe(5);
      expect(counts.pending).toBe(2);
      expect(counts.completed).toBe(2);
    });
  });
});