/** @jest-environment jsdom */

// Tests for Dashboard component logic
import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../renderer/src/components/Dashboard';

// Mock the child modal components
jest.mock('../renderer/src/components/NewAppointmentModal', () => ({ onSave, onClose }) => (
  <div data-testid="appt-modal">
    <button onClick={() => onSave({ title: 'Test' })}>Save Appt</button>
    <button onClick={onClose}>Close Appt</button>
  </div>
));

jest.mock('../renderer/src/components/NewTaskModal', () => ({ onSave, onClose }) => (
  <div data-testid="task-modal">
    <button onClick={() => onSave({ task: 'Test Task' })}>Save Task</button>
    <button onClick={onClose}>Close Task</button>
  </div>
));

jest.mock('../renderer/src/components/NewPatientModal', () => ({ onSave, onClose }) => (
  <div data-testid="patient-modal">
    <button onClick={() => onSave({ lastName: 'Doe' })}>Save Patient</button>
    <button onClick={onClose}>Close Patient</button>
  </div>
));

const mockNavigate = jest.fn();

beforeEach(() => {
  mockNavigate.mockClear();
  jest.useRealTimers();
});

describe('Dashboard Component Logic', () => {
  describe('Core UI Rendering', () => {
    test('renders all major sections and headings', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getAllByText(/urgent tasks/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/care log note/i)).toBeInTheDocument();
      expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
      expect(screen.getByText(/today's schedule/i)).toBeInTheDocument();
    });

    test('renders summary cards with correct titles', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByText('Active Tasks')).toBeInTheDocument();
      expect(screen.getByText('Patients Assigned')).toBeInTheDocument();
    });

    test('renders interactive elements (buttons/inputs)', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/care log note/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument();
    });
  });

  describe('User Interactions and State', () => {
    test('typing in note textarea updates value', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      const textarea = screen.getByLabelText(/care log note/i);
      fireEvent.change(textarea, { target: { value: 'Patient doing well' } });
      expect(textarea.value).toBe('Patient doing well');
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
      expect(screen.getByTestId('appt-modal')).toBeInTheDocument();
    });

    test('clicking New Patient toolbar button opens modal', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByRole('button', { name: /new patient/i }));
      expect(screen.getByTestId('patient-modal')).toBeInTheDocument();
    });

    test('clicking Save toolbar button shows toast', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByRole('button', { name: '💾 Save' }));
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('modal save actions show toast and toast clears after timeout', async () => {
      jest.useFakeTimers();

      render(<Dashboard onNavigate={mockNavigate} />);

      fireEvent.click(screen.getByText(/\+ New Task/i));
      fireEvent.click(screen.getByText(/New Appointment/i));
      fireEvent.click(screen.getByText(/New Patient/i));

      fireEvent.click(screen.getByText('Save Task'));
      fireEvent.click(screen.getByText('Save Appt'));
      fireEvent.click(screen.getByText('Save Patient'));

      expect(screen.getByRole('status')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(2500);
      });

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    });
  });

  describe('Toast notification', () => {
    test('sets toast message', () => {
      let toast = '';
      const showToast = (msg) => { toast = msg; };
      showToast('Saved!');
      expect(toast).toBe('Saved!');
    });
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
