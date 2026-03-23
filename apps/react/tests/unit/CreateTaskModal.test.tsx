import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTaskModal } from '../../src/app/components/CreateTaskModal';

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const defaultProps = {
  isOpen: true,
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
};

beforeEach(() => { mockOnClose.mockClear(); mockOnSubmit.mockClear(); });

describe('CreateTaskModal', () => {
  it('renders nothing when closed', () => {
    render(<CreateTaskModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });

  it('renders modal when open', () => {
    render(<CreateTaskModal {...defaultProps} />);
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('renders task title input', () => {
    render(<CreateTaskModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter task name...')).toBeInTheDocument();
  });

  it('renders priority select', () => {
    render(<CreateTaskModal {...defaultProps} />);
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
  });

  it('renders category select', () => {
    render(<CreateTaskModal {...defaultProps} />);
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
  });

  it('renders Create Task button', () => {
    render(<CreateTaskModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    render(<CreateTaskModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('calls onClose when Cancel clicked', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when X button clicked', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal {...defaultProps} />);
    await user.click(screen.getAllByRole('button', { name: 'Close modal' })[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows validation error on empty submit', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Create Task/i }));
    await waitFor(() => {
      expect(screen.getByText('Task title is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<CreateTaskModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Enter task name...'), 'Blood Pressure Check');
    await user.selectOptions(screen.getByLabelText(/Priority/i), 'High');
    await user.selectOptions(screen.getByLabelText(/Category/i), 'Assessment');
    await user.click(screen.getByRole('button', { name: /Create Task/i }));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });

  it('renders priority options', () => {
    render(<CreateTaskModal {...defaultProps} />);
    expect(screen.getByRole('option', { name: 'High' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Medium' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Low' })).toBeInTheDocument();
  });
});
