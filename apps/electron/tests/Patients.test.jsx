import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Patients from '../renderer/src/components/Patients';

// Mock the child modal to control when it calls onSave/onClose
jest.mock('../renderer/src/components/NewPatientModal', () => {
  return function MockNewPatientModal({ onClose, onSave }) {
    return (
      <div data-testid="mock-modal">
        <button onClick={onClose}>Close Mock</button>
        <button onClick={() => onSave({ lastName: 'Smith' })}>Save Mock</button>
      </div>
    );
  };
});

describe('Patients Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders the patient list and handles search filtering', () => {
    render(<Patients />);
    
    // Initial check: Should see John Davis
    expect(screen.getByText('John Davis')).toBeInTheDocument();
    
    // Search for specific patient
    const searchInput = screen.getByPlaceholderText(/Search patients/i);
    fireEvent.change(searchInput, { target: { value: 'Mary' } });
    
    expect(screen.getByText('Mary Wilson')).toBeInTheDocument();
    expect(screen.queryByText('John Davis')).not.toBeInTheDocument();

    // Search by room number
    fireEvent.change(searchInput, { target: { value: '310A' } });
    expect(screen.getByText('Robert Brown')).toBeInTheDocument();
  });

  test('selects a patient and displays their details', () => {
    render(<Patients />);
    
    // Initially shows empty state
    expect(screen.getByText(/Select a patient from the list/i)).toBeInTheDocument();
    
    // Click on a patient item
    const patientBtn = screen.getByText('John Davis').closest('button');
    fireEvent.click(patientBtn);
    
    // Check for diagnosis details from PATIENT_DETAILS
    expect(screen.getByText('Hypertension, Type 2 Diabetes')).toBeInTheDocument();
    expect(screen.getByText('Metformin 500mg')).toBeInTheDocument();
  });

  test('shows and hides toast when updating care plan', () => {
    render(<Patients />);
    
    // Select patient to show details
    fireEvent.click(screen.getByText('John Davis').closest('button'));
    
    // Click Update Care Plan
    const updateBtn = screen.getByText('Update Care Plan');
    fireEvent.click(updateBtn);
    
    // Verify Toast appears
    const toast = screen.getByRole('status');
    expect(toast).toHaveTextContent('Care plan updated.');
    
    // Fast-forward time to clear toast
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('opens and closes the NewPatientModal', () => {
    render(<Patients />);
    
    const addBtn = screen.getByText('+ Add Patient');
    fireEvent.click(addBtn);
    
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    
    // Close the modal
    fireEvent.click(screen.getByText('Close Mock'));
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  test('handles onSave from NewPatientModal and shows success toast', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<Patients />);
    
    // Open modal
    fireEvent.click(screen.getByText('+ Add Patient'));
    
    // Trigger Save from mocked modal
    fireEvent.click(screen.getByText('Save Mock'));
    
    // Verify logic in handleSavePatient
    expect(consoleSpy).toHaveBeenCalledWith('Patient Data Received:', { lastName: 'Smith' });
    expect(screen.getByText('Patient Smith added successfully!')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});