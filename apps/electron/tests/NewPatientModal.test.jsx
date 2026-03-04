import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewPatientModal from '../renderer/src/components/NewPatientModal';

describe('NewPatientModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.alert since it's used for validation
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(cleanup);

  test('renders all input fields correctly', () => {
    render(<NewPatientModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    expect(screen.getByText('Add New Patient')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  test('updates state when input values change', () => {
    render(<NewPatientModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const emailInput = screen.getByLabelText(/Email/i);

    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });

    expect(firstNameInput.value).toBe('Jane');
    expect(emailInput.value).toBe('jane@example.com');
  });

  test('shows alert and prevents onSave if required fields are missing', () => {
    render(<NewPatientModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    const addButton = screen.getByText('Add Patient');
    fireEvent.click(addButton);

    expect(window.alert).toHaveBeenCalledWith("Please fill in required fields (*)");
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('calls onSave with full data when validation passes', () => {
    render(<NewPatientModal onClose={mockOnClose} onSave={mockOnSave} />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '555-1234' } });
    
    // Fill in optional fields
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'Female' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@doe.com' } });

    const addButton = screen.getByText('Add Patient');
    fireEvent.click(addButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Doe',
      dob: '1990-01-01',
      gender: 'Female',
      phone: '555-1234',
      email: 'jane@doe.com'
    });
  });

  test('calls onClose when Cancel or Close button is clicked', () => {
    render(<NewPatientModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    const closeIcon = screen.getByLabelText('Close');
    fireEvent.click(closeIcon);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });
});