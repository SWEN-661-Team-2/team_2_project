/**
 * Navigation Tests - MainTabNavigator
 * Tests the main bottom tab navigation
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from '../../src/navigation/MainTabNavigator';
import { AppProviders } from '../../src/contexts/AppProviders';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { DashboardProvider } from '../../src/contexts/DashboardContext';

// Mock navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

const renderWithNavigation = (component) => {
  return render(
    <AppProviders>
      <AuthProvider>
        <DashboardProvider>
          <NavigationContainer>
            {component}
          </NavigationContainer>
        </DashboardProvider>
      </AuthProvider>
    </AppProviders>
  );
};

describe('MainTabNavigator Component', () => {
  describe('rendering', () => {
    test('renders main tab navigator', () => {
      const { root } = renderWithNavigation(<MainTabNavigator />);
      expect(root).toBeTruthy();
    });

    test('has navigation structure', () => {
      const component = renderWithNavigation(<MainTabNavigator />);
      expect(component).toBeTruthy();
    });

    test('navigator is properly wrapped', () => {
      const { root } = renderWithNavigation(<MainTabNavigator />);
      expect(root.children.length).toBeGreaterThan(0);
    });
  });

  describe('navigation', () => {
    test('renders with providers', () => {
      const component = renderWithNavigation(<MainTabNavigator />);
      expect(component).toBeDefined();
    });
  });

  describe('tab configuration', () => {
    test('navigation container exists', () => {
      const { root } = renderWithNavigation(<MainTabNavigator />);
      expect(root).toBeDefined();
    });
  });
});
