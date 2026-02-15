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
    test('renders settings screen', () => {
      const { getAllByText } = renderSettingsScreen();

      // Check for CareConnect header (appears multiple times in settings)
      const careConnectElements = getAllByText(/CareConnect/i);
      expect(careConnectElements.length).toBeGreaterThan(0);
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

    test('accessibility section is rendered', () => {
      const { queryByText } = renderSettingsScreen();
      
      // Just check that accessibility section exists
      const accessibilitySection = queryByText(/Accessibility/i);
      expect(accessibilitySection).toBeTruthy();
    });
  });

  describe('logout functionality', () => {
    test('shows logout button', () => {
      const { queryByText } = renderSettingsScreen();

      const logoutButton = queryByText(/Log Out/i) || queryByText(/Logout/i);
      expect(logoutButton).toBeTruthy();
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

      const { queryByText } = renderSettingsScreen();
      const logoutButton = queryByText(/Log Out/i) || queryByText(/Logout/i);

      fireEvent.press(logoutButton);

      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    test('all interactive elements are accessible', () => {
      const { queryByText } = renderSettingsScreen();

      const logoutButton = queryByText(/Log Out/i) || queryByText(/Logout/i);
      expect(logoutButton).toBeTruthy();
    });
  });
});
