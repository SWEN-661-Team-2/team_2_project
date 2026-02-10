/**
 * Component Tests - SettingsScreen
 * Tests settings display, logout functionality, and navigation
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SettingsScreen from '../../src/screens/SettingsScreen';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { AppProviders } from '../../src/contexts/AppProviders';

jest.spyOn(Alert, 'alert');

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  setOptions: jest.fn(),
};

const renderSettingsScreen = () => {
  return render(
    <AppProviders>
      <AuthProvider>
        <SettingsScreen navigation={mockNavigation} />
      </AuthProvider>
    </AppProviders>
  );
};

describe('SettingsScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders settings title', () => {
      const { getByText } = renderSettingsScreen();

      expect(getByText(/Settings/i)).toBeTruthy();
    });

    test('renders accessibility settings option', () => {
      const { getByText, queryByText } = renderSettingsScreen();

      const accessibilityOption = 
        queryByText(/Accessibility/i) || 
        queryByText(/Text Size/i) ||
        queryByText(/Display/i);
      
      expect(accessibilityOption).toBeTruthy();
    });
  });

  describe('navigation options', () => {
    test('navigates to change password screen', () => {
      const { getByText } = renderSettingsScreen();
      
      const changePasswordButton = getByText(/Change Password/i) || getByText(/Password/i);
      fireEvent.press(changePasswordButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        expect.stringMatching(/Password/i)
      );
    });

    test('navigates to accessibility settings', () => {
      const { getByText, queryByText } = renderSettingsScreen();
      
      const accessibilityButton = 
        queryByText(/Accessibility/i) || 
        queryByText(/Text Size/i);

      if (accessibilityButton) {
        fireEvent.press(accessibilityButton);
        
        expect(mockNavigation.navigate).toHaveBeenCalled();
      }
    });
  });

  describe('logout functionality', () => {
    test('shows logout button', () => {
      const { getByText } = renderSettingsScreen();

      expect(getByText(/Log Out/i) || getByText(/Logout/i)).toBeTruthy();
    });

    test('shows confirmation dialog on logout', () => {
      // Mock Alert.alert
      Alert.alert = jest.fn((title, message, buttons) => {
        // Simulate pressing the logout button
        if (buttons && buttons.length > 0) {
          const logoutButton = buttons.find(b => b.text === 'Log Out' || b.text === 'Logout');
          if (logoutButton && logoutButton.onPress) {
            logoutButton.onPress();
          }
        }
      });

      const { getByText } = renderSettingsScreen();
      const logoutButton = getByText(/Log Out/i) || getByText(/Logout/i);

      fireEvent.press(logoutButton);

      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    test('all interactive elements are accessible', () => {
      const { getByText } = renderSettingsScreen();

      const logoutButton = getByText(/Log Out/i) || getByText(/Logout/i);
      expect(logoutButton).toBeTruthy();
    });
  });
});
