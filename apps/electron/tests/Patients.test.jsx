/** @jest-environment jsdom */

import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Patients from '../renderer/src/components/Patients';

// Mock the child modal to control when it calls onSave/onClose
jest.mock('../renderer/src/components/NewPatientModal', () => {
  return function MockNewPatientModal({ onClose, onSave }) {
    return (
      <div data-testid="mock-modal">
        <h3>Add New Patient</h3>
        <button onClick={onClose}>Close Mock</button>
        <button onClick={() => onSave({ lastName: 'Smith' })}>Save Mock</button>
      </div>
    );
  };
});

describe('Patients Component Logic and Rendering', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Core Rendering and Search', () => {
    test('renders Patient Care heading and initial list', () => {
      render(<Patients />);
      expect(screen.getByText('Patient Care')).toBeInTheDocument();
      expect(screen.getByText('John Davis')).toBeInTheDocument();
    });

    test('handles search filtering by name and room', () => {
      render(<Patients />);
      const searchInput = screen.getByPlaceholderText(/Search patients/i);
      
      // Search by Name
      fireEvent.change(searchInput, { target: { value: 'Mary' } });
      expect(screen.getByText('Mary Wilson')).toBeInTheDocument();
      expect(screen.queryByText('John Davis')).not.toBeInTheDocument();

      // Search by Room
      fireEvent.change(searchInput, { target: { value: '310A' } });
      expect(screen.getByText('Robert Brown')).toBeInTheDocument();
    });
  });

  describe('Patient Selection and Details', () => {
    test('selects a patient and displays their details', () => {
      render(<Patients />);
      
      // Initially shows empty state hint
      expect(screen.getByText(/Select a patient from the list/i)).toBeInTheDocument();
      
      // Click on a patient item
      const patientBtn = screen.getByText('John Davis').closest('button');
      fireEvent.click(patientBtn);
      
      // Verify detail view content
      expect(screen.getByText('Hypertension, Type 2 Diabetes')).toBeInTheDocument();
      expect(screen.getByText('Metformin 500mg')).toBeInTheDocument();
    });

    test('shows and hides toast when updating care plan', () => {
      render(<Patients />);
      fireEvent.click(screen.getByText('John Davis').closest('button'));
      
      const updateBtn = screen.getByText('Update Care Plan');
      fireEvent.click(updateBtn);
      
      const toast = screen.getByRole('status');
      expect(toast).toHaveTextContent('Care plan updated.');
      
      act(() => {
        jest.advanceTimersByTime(2500);
      });
      
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('Modal Interactions', () => {
    test('opens and closes the NewPatientModal', () => {
      render(<Patients />);
      const addBtn = screen.getByText('+ Add Patient');
      fireEvent.click(addBtn);
      
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Close Mock'));
      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    });

    test('handles onSave from NewPatientModal and shows success toast', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      render(<Patients />);
      
      fireEvent.click(screen.getByText('+ Add Patient'));
      fireEvent.click(screen.getByText('Save Mock'));
      
      expect(consoleSpy).toHaveBeenCalledWith('Patient Data Received:', { lastName: 'Smith' });
      expect(screen.getByText('Patient Smith added successfully!')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });
});