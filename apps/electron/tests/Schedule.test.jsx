/** @jest-environment jsdom */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Schedule from '../renderer/src/components/Schedule';

// Mock the child component to simplify testing the parent's logic
jest.mock('../renderer/src/components/NewPatientModal', () => {
  return function MockModal({ onSave, onClose, availableSlots }) {
    return (
      <div data-testid="mock-modal">
        <h3>New Appointment</h3>
        <button onClick={() => onSave({ 
          time: '09:00 AM', 
          patient: 'Jane Doe', 
          duration: '45 min', 
          type: 'Checkup' 
        })}>Save</button>
        <button onClick={onClose}>Close</button>
        <div data-testid="slots-count">{availableSlots.length}</div>
      </div>
    );
  };
});

describe('Schedule Component Logic and Calendar Rendering', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Calendar Calculations (2026)', () => {
    test('February 2026 renders correctly with 28 days', () => {
      render(<Schedule />);
      expect(screen.getByText('February 2026')).toBeInTheDocument();
      
      const days = screen.getAllByRole('button', { name: /February \d, 2026/ });
      expect(days).toHaveLength(28); 
    });

    test('Calendar builder logic: February 2026 starts on Sunday (day 0)', () => {
      // Logic check for the date utility used in the component
      const firstDay = new Date(2026, 1, 1).getDay();
      expect(firstDay).toBe(0); 
    });
  });

  describe('Appointment State Management', () => {
    test('renders initial summary stats correctly', () => {
      render(<Schedule />);
      // Based on 2 completed and 2 scheduled initial appointments
      expect(screen.getByText('Total Appointments').nextSibling.textContent).toBe('4');
      expect(screen.getByText('Completed').nextSibling.textContent).toBe('2');
      expect(screen.getByText('Upcoming').nextSibling.textContent).toBe('2');
    });

    test('adds an appointment and updates UI/Summary', async () => {
      render(<Schedule />);
      
      // Open modal
      fireEvent.click(screen.getByText('+ New Appointment'));
      
      // Trigger onSave from mock (saves to 09:00 AM)
      fireEvent.click(screen.getByText('Save'));

      // Total appointments should increment from 4 to 5
      expect(screen.getByText('Total Appointments').nextSibling.textContent).toBe('5');
      
      // Verify Toast feedback
      const toast = screen.getByRole('status');
      expect(toast).toHaveTextContent('Appointment scheduled.');

      // Verify Toast disappears
      act(() => {
        jest.advanceTimersByTime(2500);
      });
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('calculates correct number of available slots for the modal', () => {
      render(<Schedule />);
      fireEvent.click(screen.getByText('+ New Appointment'));
      
      // Expected initial available slots: 09:00, 10:00, 12:00
      expect(screen.getByTestId('slots-count').textContent).toBe('3');
    });
  });

  describe('Interactive Elements', () => {
    test('opens and closes the New Appointment modal', () => {
      render(<Schedule />);
      
      fireEvent.click(screen.getByText('+ New Appointment'));
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Close'));
      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    });

    test('clicking available slot + button shows feedback', () => {
      render(<Schedule />);
      // Targets the '+' buttons in the daily schedule list
      const plusButtons = screen.getAllByRole('button', { name: /\+/i });
      fireEvent.click(plusButtons[0]);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});