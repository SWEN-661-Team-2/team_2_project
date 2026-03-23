import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewAppointmentModal } from '../../src/app/components/NewAppointmentModal';

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const defaultProps = {
  isOpen: true,
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
};

beforeEach(() => { mockOnClose.mockClear(); mockOnSubmit.mockClear(); });

describe('NewAppointmentModal', () => {
  it('renders nothing when closed', () => {
    render(<NewAppointmentModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.queryByText('New Appointment')).not.toBeInTheDocument();
  });

  it('renders modal when open', () => {
    render(<NewAppointmentModal {...defaultProps} />);
    expect(screen.getByText('New Appointment')).toBeInTheDocument();
  });

  it('renders time select', () => {
    render(<NewAppointmentModal {...defaultProps} />);
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
  });

  it('renders duration select', () => {
    render(<NewAppointmentModal {...defaultProps} />);
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument();
  });

  it('renders patient name input', () => {
    render(<NewAppointmentModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter patient name')).toBeInTheDocument();
  });

  it('renders appointment type select', () => {
    render(<NewAppointmentModal {...defaultProps} />);
    expect(screen.getByLabelText(/Appointment Type/i)).toBeInTheDocument();
  });

  it('renders Schedule Appointment button', () => {
    render(<NewAppointmentModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Save Appointment/i })).toBeInTheDocument();
  });


  it('calls onClose when X clicked', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentModal {...defaultProps} />);
    await user.click(screen.getAllByRole('button', { name: 'Close modal' })[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows validation error on empty submit', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Save Appointment/i }));
    await waitFor(() => {
      expect(screen.getByText('Time is required')).toBeInTheDocument();
    });
  });

  it('submits with valid data', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentModal {...defaultProps} />);
    await user.selectOptions(screen.getByLabelText(/Time/i), '08:00 AM');
    await user.selectOptions(screen.getByLabelText(/Duration/i), '30 min');
    await user.type(screen.getByPlaceholderText('Enter patient name'), 'John Davis');
    await user.selectOptions(screen.getByLabelText(/Appointment Type/i), 'Medication Round');
    await user.selectOptions(screen.getByLabelText(/Status/i), 'Scheduled');
    await user.click(screen.getByRole('button', { name: /Save Appointment/i }));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });
});
