/**
 * Navigation Tests - App Navigation Flow
 * Tests authentication flow, stack navigation, and route transitions
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';
import { AppProviders } from '../../src/contexts/AppProviders';
import { DashboardProvider } from '../../src/contexts/DashboardContext';
import WelcomeScreen from '../../src/screens/WelcomeScreen';
import CaregiverDashboardScreen from '../../src/screens/CaregiverDashboardScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      replace: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

describe('App Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authentication flow', () => {
    test('Welcome screen renders when not authenticated', () => {
      const { getByText } = render(
        <AppProviders>
          <AuthProvider>
            <NavigationContainer>
              <WelcomeScreen navigation={{ navigate: mockNavigate }} />
            </NavigationContainer>
          </AuthProvider>
        </AppProviders>
      );

      expect(getByText(/CareConnect/i)).toBeTruthy();
      expect(getByText(/Continue/i)).toBeTruthy();
    });

    test('navigates from Welcome to Login screen', async () => {
      const { getByText } = render(
        <AppProviders>
          <AuthProvider>
            <NavigationContainer>
              <WelcomeScreen navigation={{ navigate: mockNavigate }} />
            </NavigationContainer>
          </AuthProvider>
        </AppProviders>
      );

      const continueButton = getByText(/Continue/i);
      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('Login');
      });
    });
  });

  describe('authenticated flow', () => {
    test('Dashboard screen renders for authenticated users', () => {
      const { getByText } = render(
        <AppProviders>
          <AuthProvider>
            <DashboardProvider>
              <NavigationContainer>
                <CaregiverDashboardScreen navigation={{ navigate: mockNavigate }} />
              </NavigationContainer>
            </DashboardProvider>
          </AuthProvider>
        </AppProviders>
      );

      expect(getByText(/CareConnect/i)).toBeTruthy();
    });
  });

  describe('navigation stack', () => {
    test('Welcome screen has Continue button', () => {
      const { getByText } = render(
        <AppProviders>
          <AuthProvider>
            <NavigationContainer>
              <WelcomeScreen navigation={{ navigate: mockNavigate }} />
            </NavigationContainer>
          </AuthProvider>
        </AppProviders>
      );

      expect(getByText(/Continue/i)).toBeTruthy();
    });
  });
});
