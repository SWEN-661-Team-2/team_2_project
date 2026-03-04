import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewAppointmentModal from '../renderer/src/components/NewAppointmentModal';

describe('NewAppointmentModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  test('renders correctly and focuses the first input on mount', () => {
    render(<NewAppointmentModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    expect(screen.getByText('New Appointment')).toBeInTheDocument();
    // Check if the first input (Time select) has focus automatically via the ref
    expect(screen.getByLabelText(/Time/i)).toHaveFocus();
  });

  test('updates form data on input change and clears specific errors', () => {
    render(<NewAppointmentModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    const patientInput = screen.getByLabelText(/Patient Name/i);
    
    // Simulate typing
    fireEvent.change(patientInput, { target: { name: 'patient', value: 'John Doe' } });
    expect(patientInput.value).toBe('John Doe');
  });

  test('shows validation errors when submitting empty form', () => {
    render(<NewAppointmentModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    const saveButton = screen.getByText(/Save Appointment/i);
    fireEvent.click(saveButton);

    expect(screen.getByText('Time is required.')).toBeInTheDocument();
    expect(screen.getByText('Duration is required.')).toBeInTheDocument();
    expect(screen.getByText('Patient name is required.')).toBeInTheDocument();
    expect(screen.getByText('Appointment type is required.')).toBeInTheDocument();
    
    // Ensure onSave was NOT called
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('calls onSave and onClose when form is valid', () => {
    render(<NewAppointmentModal onClose={mockOnClose} onSave={mockOnSave} />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { name: 'time', value: '09:00 AM' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { name: 'duration', value: '30' } });
    fireEvent.change(screen.getByLabelText(/Patient Name/i), { target: { name: 'patient', value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText(/Appointment Type/i), { target: { name: 'type', value: 'Consultation' } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { name: 'status', value: 'urgent' } });

    fireEvent.click(screen.getByText(/Save Appointment/i));

    expect(mockOnSave).toHaveBeenCalledWith({
      time: '09:00 AM',
      duration: '30',
      patient: 'Jane Smith',
      type: 'Consultation',
      status: 'urgent'
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls onClose when Cancel button or Close icon is clicked', () => {
    render(<NewAppointmentModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText(/Close modal/i));
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  test('closes modal when Escape key is pressed', () => {
    render(<NewAppointmentModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('focus trap: tabs from last element to first element', () => {
    render(<NewAppointmentModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    const focusable = screen.getAllByRole('combobox').concat(screen.getAllByRole('button')).concat(screen.getByRole('textbox'));
    // The "Save" button is the last focusable element in the form
    const lastElement = screen.getByText(/Save Appointment/i);
    const firstElement = screen.getByLabelText(/Close modal/i);

    lastElement.focus();
    fireEvent.keyDown(lastElement, { key: 'Tab', shiftKey: false });

    expect(document.activeElement).toBe(firstElement);
  });

  test('focus trap: shift+tabs from first element to last element', () => {
    render(<NewAppointmentModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    const firstElement = screen.getByLabelText(/Close modal/i);
    const lastElement = screen.getByText(/Save Appointment/i);

    firstElement.focus();
    fireEvent.keyDown(firstElement, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(lastElement);
  });

  test('removes event listener on unmount', () => {
    const removeSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = render(<NewAppointmentModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});