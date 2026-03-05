/** @jest-environment jsdom */

// Tests for Dashboard component logic
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
// import '@jest-dom';
import '@testing-library/jest-dom';
import Dashboard from '../renderer/src/components/Dashboard';

// 1. Mock the child modal components (From origin/main)
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

    test('toolbar navigation buttons call onNavigate', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      // Test Appointment Modal
      fireEvent.click(screen.getByRole('button', { name: /create new appointment/i }));
      expect(screen.getByTestId('appt-modal')).toBeInTheDocument();
      // Test Patient Modal
      fireEvent.click(screen.getByRole('button', { name: /create new patient/i }));
      expect(screen.getByTestId('patient-modal')).toBeInTheDocument();
    });

    test('clicking Save toolbar button shows toast', () => {
      render(<Dashboard onNavigate={mockNavigate} />);
      // Note: Use exact string or regex for the emoji button
      // fireEvent.click(screen.getByText(/save/i));
      fireEvent.click(screen.getByRole('button', { name: /save information/i }));
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Coverage Blitz (Complex Logic & Modals)', () => {
    test('Hits all branches, state changes, and modal callbacks', async () => {
      jest.useFakeTimers();
      render(<Dashboard onNavigate={mockNavigate} />);

      // Open Modals
      fireEvent.click(screen.getByText(/\+ New Task/i));
      fireEvent.click(screen.getByText(/New Appointment/i));
      fireEvent.click(screen.getByText(/New Patient/i));

      // Trigger Modal Save Actions (using mocked buttons)
      fireEvent.click(screen.getByText('Save Task'));
      fireEvent.click(screen.getByText('Save Appt'));
      fireEvent.click(screen.getByText('Save Patient'));

      // Check toast logic and timer
      expect(screen.getByRole('status')).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(2500);
      });

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });
});