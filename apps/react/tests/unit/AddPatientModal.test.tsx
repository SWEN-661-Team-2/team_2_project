import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddPatientModal } from '../../src/app/components/AddPatientModal';

// Unit tests for the AddPatientModal component.
// Covers: mount/unmount behaviour, form validation, successful submission, and loading state.
describe('AddPatientModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  // Reset all mock call counts and implementations before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // When isOpen is false the component returns null — the DOM should be empty
  it('should not render when isOpen is false', () => {
    const { container } = render(
      <AddPatientModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(container.firstChild).toBeNull();
  });

  // Submitting an empty form should surface the required field messages
  // defined in the react-hook-form register() calls
  it('should show validation errors when submitting an empty form', async () => {
    render(<AddPatientModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/date of birth is required/i)).toBeInTheDocument();
  });

  // Filling all required fields and submitting should call both onSubmit and onClose.
  // Uses a 2s waitFor timeout to accommodate the 600ms artificial delay in handleFormSubmit.
  it('should call onSubmit and onClose with valid data after the artificial delay', async () => {
    render(<AddPatientModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/first name/i),    { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/last name/i),     { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/gender/i),        { target: { value: 'Female' } });
    fireEvent.change(screen.getByLabelText(/phone number/i),  { target: { value: '5551234567' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'Jane',
        lastName:  'Doe',
        email:     'jane@example.com',
      }));
    }, { timeout: 2000 });

    expect(mockOnClose).toHaveBeenCalled();
  });

  // Immediately after clicking submit the button should show "Processing..."
  // and be disabled — checked before the 600ms delay resolves.
  it('should show "Processing..." state during submission', async () => {
    render(<AddPatientModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/first name/i),    { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/last name/i),     { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/gender/i),        { target: { value: 'Female' } });
    fireEvent.change(screen.getByLabelText(/phone number/i),  { target: { value: '5551234567' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));

    // Loading state is synchronously visible before the async delay resolves
    expect(screen.getByText(/processing.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /processing.../i })).toBeDisabled();
  });
});
