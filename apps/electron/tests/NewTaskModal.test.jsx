import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewTaskModal from '../renderer/src/components/NewTaskModal';

describe('NewTaskModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  test('renders with initial default values', () => {
    render(<NewTaskModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task name...')).toBeInTheDocument();
    
    // Verify default select values
    expect(screen.getByLabelText(/Priority/i).value).toBe('medium');
    expect(screen.getByLabelText(/Category/i).value).toBe('Medication');
  });

  test('updates task title on input change', () => {
    render(<NewTaskModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    const input = screen.getByPlaceholderText('Enter task name...');
    fireEvent.change(input, { target: { value: 'Give Insulin' } });
    
    expect(input.value).toBe('Give Insulin');
  });

  test('updates priority and category on select change', () => {
    render(<NewTaskModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    const prioritySelect = screen.getByLabelText(/Priority/i);
    const categorySelect = screen.getByLabelText(/Category/i);

    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.change(categorySelect, { target: { value: 'Assessment' } });

    expect(prioritySelect.value).toBe('high');
    expect(categorySelect.value).toBe('Assessment');
  });

  test('does not call onSave if title is empty', () => {
    render(<NewTaskModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    // This hits the "if (!task.title) return;" line
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('calls onSave with form data when title is provided', () => {
    render(<NewTaskModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter task name...'), {
      target: { value: 'Vitals Check' }
    });
    
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'Vitals Check',
      priority: 'medium',
      category: 'Medication'
    });
  });

  test('calls onClose when Cancel or the X button is clicked', () => {
    render(<NewTaskModal onClose={mockOnClose} onSave={mockOnSave} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('X'));
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });
});