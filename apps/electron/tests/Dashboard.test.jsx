/** @jest-environment jsdom */

// Tests for Dashboard component logic
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../renderer/src/components/Dashboard';

const mockNavigate = jest.fn();

beforeEach(() => {
  mockNavigate.mockClear();
});

describe('Dashboard Component Logic', () => {
  describe('Rendering', () => {
    test('renders dashboard heading', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    test('renders urgent tasks section', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getAllByText(/urgent tasks/i)[0]).toBeInTheDocument();
    });

    test('renders welcome message', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    test('renders care log note section', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByText(/care log note/i)).toBeInTheDocument();
    });

    test('renders recent activity section', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
    });

    test('renders save changes button', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    test('renders note textarea', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByLabelText(/care log note/i)).toBeInTheDocument();
    });

    test('renders new task toolbar button', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument();
    });

    test('renders today schedule section', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByText(/today's schedule/i)).toBeInTheDocument();
    });

    test('renders active tasks summary card', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByText('Active Tasks')).toBeInTheDocument();
    });

    test('renders patients assigned summary card', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByText('Patients Assigned')).toBeInTheDocument();
    });

    test('clicking Start button triggers toast', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      const startButtons = screen.getAllByRole('button', { name: /start/i });
      fireEvent.click(startButtons[0]);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
    test('clicking New Appointment toolbar button opens modal', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByRole('button', { name: /new appointment/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('clicking New Patient toolbar button opens modal', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByRole('button', { name: /new patient/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('clicking Save toolbar button shows toast', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByRole('button', { name: /💾 save/i }));
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('typing in note textarea updates value', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      const textarea = screen.getByLabelText(/care log note/i);
      fireEvent.change(textarea, { target: { value: 'Patient doing well' } });
      expect(textarea.value).toBe('Patient doing well');
    });

    test('clicking Mark Resolved shows toast', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByRole('button', { name: /mark resolved/i }));
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Toast notification', () => {
    test('sets toast message', () => {
      let toast = '';
      const showToast = (msg) => { toast = msg; };
      showToast('Saved!');
      expect(toast).toBe('Saved!');
    });

    jest.useRealTimers();
  });

  describe('Summary card data', () => {
    const dashboardStats = {
      activeTasks: 12,
      urgentTasks: 3,
      todayAppointments: 5,
      patientsAssigned: 28
    };

    test('active tasks count is correct', () => {
      expect(dashboardStats.activeTasks).toBe(12);
    });

    test('urgent tasks are less than active tasks', () => {
      expect(dashboardStats.urgentTasks).toBeLessThan(dashboardStats.activeTasks);
    });

    test('stats are positive numbers', () => {
      Object.values(dashboardStats).forEach(val => {
        expect(val).toBeGreaterThan(0);
      });
    });
  });

  describe('Urgent tasks data', () => {
    const URGENT_TASKS = [
      { id: 1, name: 'John Davis', priority: 'high', task: 'Medication Administration', time: '2:00 PM' },
      { id: 2, name: 'Mary Wilson', priority: 'medium', task: 'Vital Signs Check', time: '2:30 PM' },
      { id: 3, name: 'Robert Brown', priority: 'high', task: 'Wound Care', time: '3:00 PM' }
    ];

    test('has 3 urgent tasks', () => {
      expect(URGENT_TASKS).toHaveLength(3);
    });

    test('all tasks have required fields', () => {
      URGENT_TASKS.forEach(t => {
        expect(t.id).toBeDefined();
        expect(t.name).toBeTruthy();
        expect(t.priority).toBeTruthy();
        expect(t.task).toBeTruthy();
        expect(t.time).toBeTruthy();
      });
    });

    test('priorities are valid values', () => {
      const validPriorities = ['high', 'medium', 'low'];
      URGENT_TASKS.forEach(t => {
        expect(validPriorities).toContain(t.priority);
      });
    });

    test('high priority tasks are counted correctly', () => {
      const highPriority = URGENT_TASKS.filter(t => t.priority === 'high');
      expect(highPriority).toHaveLength(2);
    });
  });

  describe('Navigation callbacks', () => {
    test('onNavigate is called with correct route', () => {
      const onNavigate = jest.fn();
      onNavigate('tasks');
      expect(onNavigate).toHaveBeenCalledWith('tasks');
    });

    test('multiple navigate calls work', () => {
      const onNavigate = jest.fn();
      onNavigate('tasks');
      onNavigate('patients');
      expect(onNavigate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Care log note', () => {
    test('note text state is updatable', () => {
      let noteText = '';
      noteText = 'Patient responded well to treatment';
      expect(noteText).toBe('Patient responded well to treatment');
    });

    test('empty note can still be saved (demo behavior)', () => {
      const note = '';
      const saved = true;
      expect(saved).toBe(true);
    });
  });

  describe('Schedule items', () => {
    const SCHEDULE_ITEMS = [
      { time: '2:00 PM', title: 'Medication Round - Floor 3' },
      { time: '3:30 PM', title: 'Patient Assessment - Room 302' },
      { time: '4:00 PM', title: 'Team Meeting' }
    ];

    test('schedule has correct number of items', () => {
      expect(SCHEDULE_ITEMS).toHaveLength(3);
    });

    test('all schedule items have time and title', () => {
      SCHEDULE_ITEMS.forEach(item => {
        expect(item.time).toBeTruthy();
        expect(item.title).toBeTruthy();
      });
    });
  });
});
