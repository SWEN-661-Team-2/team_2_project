import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddPatientModal } from '../../src/app/components/AddPatientModal';

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const defaultProps = {
  isOpen: true,
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
};

beforeEach(() => {
  mockOnClose.mockClear();
  mockOnSubmit.mockClear();
});

describe('AddPatientModal', () => {
  it('renders nothing when closed', () => {
    render(<AddPatientModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.queryByText('Add New Patient')).not.toBeInTheDocument();
  });

  it('renders modal when open', () => {
    render(<AddPatientModal {...defaultProps} />);
    expect(screen.getByText('Add New Patient')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<AddPatientModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter first name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter last name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('patient@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('(555) 123-4567')).toBeInTheDocument();
  });

  it('renders gender select', () => {
    render(<AddPatientModal {...defaultProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders Add Patient submit button', () => {
    render(<AddPatientModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Add Patient/i })).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    render(<AddPatientModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('calls onClose when Cancel clicked', async () => {
    const user = userEvent.setup();
    render(<AddPatientModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when X button clicked', async () => {
    const user = userEvent.setup();
    render(<AddPatientModal {...defaultProps} />);
    await user.click(screen.getAllByRole('button', { name: 'Close modal' })[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    render(<AddPatientModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Add Patient/i }));
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });
  });

  it('shows last name validation error', async () => {
    const user = userEvent.setup();
    render(<AddPatientModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Add Patient/i }));
    await waitFor(() => {
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<AddPatientModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Enter first name'), 'John');
    await user.type(screen.getByPlaceholderText('Enter last name'), 'Doe');
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
    await user.selectOptions(screen.getByRole('combobox'), 'Male');
    await user.type(screen.getByPlaceholderText('(555) 123-4567'), '5551234567');
    await user.type(screen.getByPlaceholderText('patient@example.com'), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /Add Patient/i }));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });

  it('renders date of birth field', () => {
    render(<AddPatientModal {...defaultProps} />);
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
  });
});
