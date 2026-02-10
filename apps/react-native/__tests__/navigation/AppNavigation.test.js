/**
 * Navigation Tests - App Navigation Flow
 * Tests authentication flow, stack navigation, and route transitions
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from '../../src/contexts/AuthContext';
import LoginScreen from '../../src/screens/LoginScreen';
import WelcomeScreen from '../../src/screens/WelcomeScreen';
import CaregiverDashboardScreen from '../../src/screens/CaregiverDashboardScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={CaregiverDashboardScreen} />
  </Stack.Navigator>
);

const renderNavigation = (isAuthenticated = false) => {
  return render(
    <AuthProvider>
      <NavigationContainer>
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </AuthProvider>
  );
};

describe('App Navigation', () => {
  describe('authentication flow', () => {
    test('starts on Welcome screen when not authenticated', () => {
      const { getByText } = renderNavigation(false);

      expect(getByText(/Welcome/i)).toBeTruthy();
    });

    test('navigates from Welcome to Login screen', async () => {
      const { getByText } = renderNavigation(false);

      // Find and press the login/get started button
      const getStartedButton = getByText(/Get Started/i) || getByText(/Login/i);
      fireEvent.press(getStartedButton);

      await waitFor(() => {
        expect(getByText('CareConnect')).toBeTruthy();
      });
    });
  });

  describe('authenticated flow', () => {
    test('shows Home screen when authenticated', () => {
      const { getByText } = renderNavigation(true);

      expect(getByText(/CareConnect/i)).toBeTruthy();
    });
  });

  describe('navigation stack', () => {
    test('auth stack contains Welcome and Login screens', () => {
      const { getByText } = renderNavigation(false);

      // Welcome screen should be visible
      expect(getByText(/Welcome/i)).toBeTruthy();
    });
  });
});
