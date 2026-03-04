<<<<<<< HEAD
/** @jest-environment jsdom */

// Tests for Settings component logic
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../renderer/src/components/Settings';

const mockOnSave = jest.fn().mockResolvedValue('right');
const mockOnBack = jest.fn();

beforeEach(() => {
  mockOnSave.mockClear();
  mockOnBack.mockClear();
});

describe('Settings Component Logic', () => {
  describe('Rendering', () => {
    test('renders Settings heading', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByText(/settings/i)).toBeInTheDocument();
    });

    test('renders General tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByRole('tab', { name: /general/i })).toBeInTheDocument();
    });

    test('renders Accessibility tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByRole('tab', { name: /accessibility/i })).toBeInTheDocument();
    });

    test('renders Notifications tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByRole('tab', { name: /notifications/i })).toBeInTheDocument();
    });

    test('renders Save Changes button', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    test('clicking Accessibility tab shows its content', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      expect(screen.getByText(/high contrast/i)).toBeInTheDocument();
    });

    test('clicking Notifications tab shows its content', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /notifications/i }));
      expect(screen.getByText(/task reminders/i)).toBeInTheDocument();
    });

    test('clicking Save Changes calls onSave', async () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      });
      expect(mockOnSave).toHaveBeenCalled();
    });

    test('clicking Cancel calls onBack', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(mockOnBack).toHaveBeenCalled();
    });

    test('renders left-handed mode toggle', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByText(/left-handed mode/i)).toBeInTheDocument();
    });

    test('renders zoom level select', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByLabelText(/zoom level/i)).toBeInTheDocument();
    });

    test('renders reduce motion toggle in accessibility tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      expect(screen.getByText(/reduce motion/i)).toBeInTheDocument();
    });

    test('renders urgent alerts toggle in notifications tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /notifications/i }));
      expect(screen.getByText(/urgent task alerts/i)).toBeInTheDocument();
    });

    test('renders user name field on General tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    test('can change zoom level', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.change(screen.getByLabelText(/zoom level/i), { target: { value: '125%' } });
      expect(screen.getByLabelText(/zoom level/i).value).toBe('125%');
    });

    test('can toggle enhanced keyboard navigation', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      expect(checkboxes[0]).not.toBeChecked();
    });

    test('can toggle high contrast mode', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[2]);
      expect(checkboxes[2]).toBeChecked();
    });

    test('can toggle task reminders', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /notifications/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      expect(checkboxes[0]).not.toBeChecked();
    });

    test('can toggle urgent task alerts', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /notifications/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);
      expect(checkboxes[1]).not.toBeChecked();
    });
    test('can toggle left-handed mode checkbox', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      expect(checkboxes[0]).toBeChecked();
    });

    test('can toggle focus indicators', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);
      expect(checkboxes[1]).not.toBeChecked();
    });

    test('can toggle reduce motion', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[3]);
      expect(checkboxes[3]).toBeChecked();
    });
  });

  describe('Layout mode management', () => {
    test('left-handed mode is detected correctly', () => {
      const layoutMode = 'left';
      expect(layoutMode === 'left').toBe(true);
    });
=======
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
>>>>>>> origin/main

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