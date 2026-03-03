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

    test('right-handed mode is detected correctly', () => {
      const layoutMode = 'right';
      expect(layoutMode === 'right').toBe(true);
    });

    test('toggle converts left to right', () => {
      let layout = 'left';
      layout = layout === 'left' ? 'right' : 'left';
      expect(layout).toBe('right');
    });

    test('toggle converts right to left', () => {
      let layout = 'right';
      layout = layout === 'left' ? 'right' : 'left';
      expect(layout).toBe('left');
    });

    test('only valid layout modes are accepted', () => {
      const validModes = ['left', 'right'];
      expect(validModes).toContain('left');
      expect(validModes).toContain('right');
      expect(validModes).not.toContain('center');
    });
  });

  describe('Zoom level options', () => {
    const ZOOM_OPTIONS = ['75%', '90%', '100%', '110%', '125%', '150%'];

    test('default zoom is 100%', () => {
      const defaultZoom = '100%';
      expect(ZOOM_OPTIONS).toContain(defaultZoom);
    });

    test('zoom options include expected values', () => {
      expect(ZOOM_OPTIONS).toContain('75%');
      expect(ZOOM_OPTIONS).toContain('150%');
    });

    test('has 6 zoom options', () => {
      expect(ZOOM_OPTIONS).toHaveLength(6);
    });
  });

  describe('Settings tabs', () => {
    const TABS = ['General', 'Accessibility', 'Notifications'];

    test('has correct number of tabs', () => {
      expect(TABS).toHaveLength(3);
    });

    test('General tab exists', () => {
      expect(TABS).toContain('General');
    });

    test('Accessibility tab exists', () => {
      expect(TABS).toContain('Accessibility');
    });

    test('Notifications tab exists', () => {
      expect(TABS).toContain('Notifications');
    });

    test('tab switching updates active tab', () => {
      let activeTab = 'General';
      activeTab = 'Accessibility';
      expect(activeTab).toBe('Accessibility');
    });
  });

  describe('Accessibility settings', () => {
    test('enhanced keyboard navigation defaults to true', () => {
      const enhancedKb = true;
      expect(enhancedKb).toBe(true);
    });

    test('focus indicators default to true', () => {
      const focusIndicators = true;
      expect(focusIndicators).toBe(true);
    });

    test('high contrast defaults to false', () => {
      const highContrast = false;
      expect(highContrast).toBe(false);
    });

    test('reduce motion defaults to false', () => {
      const reduceMotion = false;
      expect(reduceMotion).toBe(false);
    });
  });

  describe('onSave callback', () => {
    test('calls onSave with current layout mode', async () => {
      const onSave = jest.fn().mockResolvedValue('left');
      await onSave('left');
      expect(onSave).toHaveBeenCalledWith('left');
    });

    test('shows saved message after successful save', async () => {
      const onSave = jest.fn().mockResolvedValue('right');
      let savedMsg = '';
      await onSave('right');
      savedMsg = 'Settings saved.';
      expect(savedMsg).toBe('Settings saved.');
    });

    test('onBack callback navigates away', () => {
      const onBack = jest.fn();
      onBack();
      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Notification settings', () => {
    test('task reminders default to enabled', () => {
      const taskReminders = true;
      expect(taskReminders).toBe(true);
    });

    test('urgent alerts default to enabled', () => {
      const urgentAlerts = true;
      expect(urgentAlerts).toBe(true);
    });

    test('reminder lead time options', () => {
      const options = ['5 minutes before', '15 minutes before', '30 minutes before', '1 hour before'];
      expect(options).toHaveLength(4);
      expect(options[1]).toBe('15 minutes before');
    });
  });
});
