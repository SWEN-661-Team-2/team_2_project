import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../renderer/src/components/Settings';

describe('Settings Component', () => {
  const mockOnSave = jest.fn(() => Promise.resolve());
  const mockOnBack = jest.fn();
  const defaultProps = {
    layoutMode: 'right',
    onSave: mockOnSave,
    onBack: mockOnBack,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders and switches between all tabs', () => {
    render(<Settings {...defaultProps} />);
    
    // Check initial tab (General)
    expect(screen.getByText('Layout Preferences')).toBeInTheDocument();

    // Switch to Accessibility
    fireEvent.click(screen.getByRole('tab', { name: 'Accessibility' }));
    expect(screen.getByText('Keyboard & Navigation')).toBeInTheDocument();

    // Switch to Notifications
    fireEvent.click(screen.getByRole('tab', { name: 'Notifications' }));
    expect(screen.getByText('Task Notifications')).toBeInTheDocument();
    
    // Switch back to General
    fireEvent.click(screen.getByRole('tab', { name: 'General' }));
    expect(screen.getByText('Layout Preferences')).toBeInTheDocument();
  });

  test('handles General tab inputs (Layout, Zoom, and Text inputs)', () => {
    render(<Settings {...defaultProps} />);

    // Toggle Left-Handed Mode
    const layoutToggle = screen.getByLabelText('', { selector: 'input[type="checkbox"]' }); // First checkbox
    fireEvent.click(layoutToggle);
    expect(layoutToggle.checked).toBe(true);
    
    fireEvent.click(layoutToggle);
    expect(layoutToggle.checked).toBe(false);

    // Change Zoom Level
    const zoomSelect = screen.getByLabelText('Default Zoom Level');
    fireEvent.change(zoomSelect, { target: { value: '150%' } });
    expect(zoomSelect.value).toBe('150%');

    // Name and Role inputs (testing defaultValue/render)
    expect(screen.getByLabelText('Name')).toHaveValue('Sarah Johnson, RN');
    expect(screen.getByLabelText('Role')).toHaveValue('Registered Nurse');
  });

  test('handles Accessibility tab toggles', () => {
    render(<Settings {...defaultProps} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Accessibility' }));

    const toggles = screen.getAllByRole('checkbox');
    // enhancedKb (idx 0), focusIndicators (idx 1), highContrast (idx 2), reduceMotion (idx 3)
    
    fireEvent.click(toggles[0]); // Disable Enhanced KB
    expect(toggles[0].checked).toBe(false);

    fireEvent.click(toggles[2]); // Enable High Contrast
    expect(toggles[2].checked).toBe(true);
  });

  test('handles Notifications tab toggles and selects', () => {
    render(<Settings {...defaultProps} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Notifications' }));

    const taskToggle = screen.getAllByRole('checkbox')[0];
    fireEvent.click(taskToggle);
    expect(taskToggle.checked).toBe(false);

    const leadTime = screen.getByLabelText('Reminder Lead Time');
    fireEvent.change(leadTime, { target: { value: '1 hour before' } });
  });

  test('triggers onBack when Cancel is clicked', () => {
    render(<Settings {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('handles handleSave, shows toast, and clears it via timer', async () => {
    render(<Settings {...defaultProps} />);
    
    const saveBtn = screen.getByText('Save Changes');
    
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    expect(mockOnSave).toHaveBeenCalledWith('right');
    
    // Check toast appearance
    const toast = screen.getByRole('status');
    expect(toast).toHaveTextContent('Settings saved.');

    // Fast-forward 2.5 seconds
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    // Check toast disappearance
    expect(screen.queryByText('Settings saved.')).not.toBeInTheDocument();
  });
});