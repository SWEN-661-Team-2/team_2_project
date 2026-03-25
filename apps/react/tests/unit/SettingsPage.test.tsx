import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsPage } from '../../src/app/components/SettingsPage';
import { useAppContext } from '../../src/app/context/AppContext';

// Mock the context hook
vi.mock('../../src/app/context/AppContext', () => ({
  useAppContext: vi.fn(),
}));

const mockSettings = {
  theme: 'light',
  leftHandedMode: false,
  defaultZoom: '100%',
  userName: 'Eduardo Estrada',
  userRole: 'Admin',
  enhancedKeyboardNav: false,
  alwaysFocusIndicators: false,
  highContrastMode: false,
  reduceMotion: false,
  taskReminders: true,
  urgentTaskAlerts: true,
  reminderLeadTime: '15 minutes',
};

describe('SettingsPage Component', () => {
  const updateAllSettings = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppContext as any).mockReturnValue({
      state: { settings: mockSettings },
      updateAllSettings,
    });
    // For timer based toast
    vi.useFakeTimers();
  });

  it('switches tabs and displays relevant content', () => {
    render(<SettingsPage />);
    
    // Click Accessibility tab
    fireEvent.click(screen.getByText('Accessibility'));
    expect(screen.getByText('Visual & Motion')).toBeInTheDocument();
    expect(screen.queryByText('Appearance')).not.toBeInTheDocument();

    // Click Notifications tab
    fireEvent.click(screen.getByText('Notifications'));
    expect(screen.getByText('Task Alerts')).toBeInTheDocument();
  });

  it('updates local state and shows "Unsaved Changes" indicator', () => {
    render(<SettingsPage />);
    
    const nameInput = screen.getByLabelText('Display Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
    // Buttons should be enabled
    expect(screen.getByRole('button', { name: /save changes/i })).not.toBeDisabled();
  });

  it('reverts changes when "Cancel" is clicked', () => {
    render(<SettingsPage />);
    
    const nameInput = screen.getByLabelText('Display Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByDisplayValue('Eduardo Estrada')).toBeInTheDocument();
    expect(screen.queryByText('Unsaved Changes')).not.toBeInTheDocument();
  });

  it('calls context update and shows toast on "Save"', async () => {
    render(<SettingsPage />);
    
    // Toggle a switch
    const accessibilityTab = screen.getByText('Accessibility');
    fireEvent.click(accessibilityTab);
    
    const highContrastToggle = screen.getByRole('switch', { name: /high contrast mode/i });
    fireEvent.click(highContrastToggle);

    // Save
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveBtn);

    // Verify context call
    expect(updateAllSettings).toHaveBeenCalledWith(expect.objectContaining({
      highContrastMode: true
    }));

    // Check Toast
    expect(screen.getByText('Preferences Updated')).toBeInTheDocument();

    // Fast-forward time to hide toast
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText('Preferences Updated')).not.toBeInTheDocument();
  });

  it('updates theme selection visually', () => {
    render(<SettingsPage />);
    
    const darkBtn = screen.getByRole('button', { name: /dark mode/i });
    fireEvent.click(darkBtn);

    // Should now have active styling
    expect(darkBtn).toHaveClass('border-blue-500');
    // Light mode button should lose active styling
    expect(screen.getByRole('button', { name: /light mode/i })).toHaveClass('border-slate-300');
  });
});