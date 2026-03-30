import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsPage } from '../../src/app/components/SettingsPage';
import { useAppContext } from '../../src/app/context/AppContext';

// Mock the AppContext hook so SettingsPage receives controlled state
// without needing a real AppProvider or localStorage
vi.mock('../../src/app/context/AppContext', () => ({
  useAppContext: vi.fn(),
}));

// Base settings object shared across all tests
const mockSettings = {
  theme:                'light',
  leftHandedMode:       false,
  defaultZoom:          '100%',
  userName:             'Eduardo Estrada',
  userRole:             'Admin',
  enhancedKeyboardNav:  false,
  alwaysFocusIndicators:false,
  highContrastMode:     false,
  reduceMotion:         false,
  taskReminders:        true,
  urgentTaskAlerts:     true,
  reminderLeadTime:     '15 minutes',
};

// Unit tests for SettingsPage.
// Covers: tab switching, unsaved changes indicator, cancel revert,
// save with toast, and theme button active styling.
describe('SettingsPage Component', () => {
  const updateAllSettings = vi.fn();

  // Re-apply the mock context and enable fake timers before each test.
  // Fake timers allow the 3s toast timeout to be advanced synchronously.
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppContext as ReturnType<typeof vi.fn>).mockReturnValue({
      state: { settings: mockSettings },
      updateAllSettings,
    });
    vi.useFakeTimers();
  });

  // Clicking Accessibility tab should show Visual & Motion section
  // and hide the General tab's Appearance section
  it('switches tabs and displays relevant content', () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByText('Accessibility'));
    expect(screen.getByText('Visual & Motion')).toBeInTheDocument();
    expect(screen.queryByText('Appearance')).not.toBeInTheDocument();

    // Notifications tab should show Task Alerts section
    fireEvent.click(screen.getByText('Notifications'));
    expect(screen.getByText('Task Alerts')).toBeInTheDocument();
  });

  // Changing a field should set hasUnsavedChanges to true,
  // surfacing the indicator and enabling the Save/Cancel buttons
  it('updates local state and shows "Unsaved Changes" indicator', () => {
    render(<SettingsPage />);

    const nameInput = screen.getByLabelText('Display Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).not.toBeDisabled();
  });

  // Clicking Cancel should revert the input to the original context value
  // and clear the unsaved changes indicator
  it('reverts changes when "Cancel" is clicked', () => {
    render(<SettingsPage />);

    const nameInput = screen.getByLabelText('Display Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByDisplayValue('Eduardo Estrada')).toBeInTheDocument();
    expect(screen.queryByText('Unsaved Changes')).not.toBeInTheDocument();
  });

  // Saving after toggling a switch should call updateAllSettings with the updated value
  // and show the success toast. Advancing fake timers by 3s should hide it.
  it('calls context update and shows toast on "Save"', async () => {
    render(<SettingsPage />);

    // Navigate to Accessibility tab and toggle High Contrast Mode on
    fireEvent.click(screen.getByText('Accessibility'));
    fireEvent.click(screen.getByRole('switch', { name: /high contrast mode/i }));

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    // Context should be called with the updated setting
    expect(updateAllSettings).toHaveBeenCalledWith(
      expect.objectContaining({ highContrastMode: true })
    );

    // Toast should appear immediately after save
    expect(screen.getByText('Preferences Updated')).toBeInTheDocument();

    // Advance timers past the 3s auto-dismiss timeout
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Preferences Updated')).not.toBeInTheDocument();
  });

  // Clicking Dark Mode should apply the active border class to that button
  // and remove it from the Light Mode button
  it('updates theme selection visually', () => {
    render(<SettingsPage />);

    const darkBtn  = screen.getByRole('button', { name: /dark mode/i });
    const lightBtn = screen.getByRole('button', { name: /light mode/i });

    fireEvent.click(darkBtn);

    expect(darkBtn).toHaveClass('border-blue-500');
    expect(lightBtn).toHaveClass('border-slate-300');
  });
});
