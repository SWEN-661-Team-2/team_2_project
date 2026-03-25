import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddPatientModal } from '../../src/app/components/AddPatientModal';

describe('AddPatientModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <AddPatientModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should show validation errors when submitting an empty form', async () => {
    render(<AddPatientModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    // Click the submit button
    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));

    // Check for validation messages defined in your register() calls
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/date of birth is required/i)).toBeInTheDocument();
  });

  it('should call onSubmit and onClose with valid data after the artificial delay', async () => {
    render(<AddPatientModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    // Fill out the required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: 'Female' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '5551234567' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));

    // Since you have a 600ms setTimeout in handleFormSubmit, 
    // we use waitFor with a longer timeout to wait for the logic to finish.
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com'
      }));
    }, { timeout: 2000 });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show "Processing..." state during submission', async () => {
    render(<AddPatientModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    // Fill minimum required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: 'Female' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '5551234567' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));

    // Verify the loading state text appears
    expect(screen.getByText(/processing.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /processing.../i })).toBeDisabled();
  });
});