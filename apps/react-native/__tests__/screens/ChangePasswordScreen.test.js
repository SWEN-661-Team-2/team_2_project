/**
 * Component Tests - ChangePasswordScreen
 * Hardened for 100% Coverage & WK6 Accessibility:
 * - Visibility toggling (Lines 21-23)
 * - Left-handed layout branches (Lines 111, 149)
 * - Navigation fallbacks (Lines 43-44)
 * - Loading/Saving states (Lines 77, 85, 112)
 * - Accessibility Props verification
 */
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ChangePasswordScreen from '../../src/screens/ChangePasswordScreen';
import * as AuthContext from '../../src/contexts/AuthContext';
import * as AppProviders from '../../src/contexts/AppProviders';

// Mock the hooks
jest.mock('../../src/contexts/AuthContext');
jest.mock('../../src/contexts/AppProviders');
jest.spyOn(Alert, 'alert');

describe('ChangePasswordScreen Hardening', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
    setOptions: jest.fn(),
  };

  const mockChangePassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Default Mock States
    AppProviders.useHandedness.mockReturnValue({ isLeftHanded: false });
    AuthContext.useAuth.mockReturnValue({
      changePassword: mockChangePassword,
      loading: false,
      error: null,
    });
  });

test('toggles password visibility and updates accessibility labels', () => {
    render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    const oldPassInput = screen.getByTestId('change_old');
    
    // Use getAllByLabelText because there are 3 password fields
    const toggleButtons = screen.getAllByLabelText('Show password');
    const firstToggleButton = toggleButtons[0]; // This is the 'Old Password' toggle
    
    expect(oldPassInput.props.secureTextEntry).toBe(true);
    
    // Toggle field visibility
    fireEvent.press(firstToggleButton);
    expect(oldPassInput.props.secureTextEntry).toBe(false);
    
    // Now check that the label updated to "Hide password" for that specific button
    expect(screen.getByLabelText('Hide password')).toBeTruthy();
  });

  test('handles navigation back fallback (Lines 43-44)', () => {
    // Case 1: Can go back
    mockNavigation.canGoBack.mockReturnValue(true);
    const { rerender } = render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    fireEvent.press(screen.getByLabelText('Back to Settings'));
    expect(mockNavigation.goBack).toHaveBeenCalled();

    // Case 2: Cannot go back, fallback to Settings
    mockNavigation.canGoBack.mockReturnValue(false);
    rerender(<ChangePasswordScreen navigation={mockNavigation} />);
    
    fireEvent.press(screen.getByLabelText('Back to Settings'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Settings');
  });

  test('executes successful password change and navigates back', async () => {
    mockChangePassword.mockResolvedValue(true);
    render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(screen.getByTestId('change_old'), 'old123');
    fireEvent.changeText(screen.getByTestId('change_new'), 'new123');
    fireEvent.changeText(screen.getByTestId('change_confirm'), 'new123');
    
    fireEvent.press(screen.getByTestId('change_save'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Password updated successfully');
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  test('verifies accessibility state during loading (Lines 77, 85)', () => {
    AuthContext.useAuth.mockReturnValue({
      changePassword: mockChangePassword,
      loading: true,
      error: null,
    });
    
    render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    const saveButton = screen.getByTestId('change_save');
    
    expect(screen.getByText('Saving...')).toBeTruthy();
    expect(saveButton.props.accessibilityState.busy).toBe(true);
    expect(saveButton.props.accessibilityState.disabled).toBe(true);
    expect(screen.getByTestId('change_old').props.editable).toBe(false);
  });

  test('renders error with assertive live region for screen readers', () => {
    AuthContext.useAuth.mockReturnValue({
      changePassword: mockChangePassword,
      loading: false,
      error: 'Passwords do not match',
    });

    render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    const errorMsg = screen.getByText('Passwords do not match');
    expect(errorMsg.props.accessibilityLiveRegion).toBe('assertive');
    expect(errorMsg.props.accessibilityRole).toBe('alert');
  });

  test('applies left-handed styles to text alignment (Line 111)', () => {
    AppProviders.useHandedness.mockReturnValue({ isLeftHanded: true });
    
    render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    const input = screen.getByTestId('change_old');
    // Ensure the style array contains the RTL/Left-handed alignment
    expect(input.props.style).toContainEqual({ textAlign: 'right' });
  });
});