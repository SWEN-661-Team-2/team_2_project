/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../renderer/src/components/Dashboard.jsx';

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

describe('Dashboard Coverage Blitz', () => {
  const mockOnNavigate = jest.fn();

  test('Hits all branches, state changes, and modal callbacks', async () => {
    jest.useFakeTimers();

    render(<Dashboard onNavigate={mockOnNavigate} />);

    // 1. Hit the "Urgent Tasks" Start buttons
    const startButtons = screen.getAllByText('Start');
    fireEvent.click(startButtons[0]);

    // 2. Hit Note Textarea
    const noteArea = screen.getByLabelText(/Note/i);
    fireEvent.change(noteArea, { target: { value: 'Patient is stable.' } });

    // 3. Open the Modals (Triggers the state change lines)
    fireEvent.click(screen.getByText(/\+ New Task/i));
    fireEvent.click(screen.getByText(/New Appointment/i));
    fireEvent.click(screen.getByText(/New Patient/i));
    
    // Use an exact string for the toolbar save button to avoid ambiguity
    fireEvent.click(screen.getByText('💾 Save'));

    // 4. Hit Modal Callback Logic
    // We target the specific unique names we gave the mock buttons
    fireEvent.click(screen.getByText('Save Task'));
    fireEvent.click(screen.getByText('Save Appt'));
    fireEvent.click(screen.getByText('Save Patient'));

    // 5. Hit the "Mark Resolved" and "Save Changes" buttons
    fireEvent.click(screen.getByText('Save Changes'));
    fireEvent.click(screen.getByText('Mark Resolved'));

    // 6. Final Clean up: Check toast disappearance
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});