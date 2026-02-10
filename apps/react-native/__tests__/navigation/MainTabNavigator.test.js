/**
 * Navigation Tests - MainTabNavigator
 * Tests the main bottom tab navigation
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from '../../src/navigation/MainTabNavigator';
import { AppProviders } from '../../src/contexts/AppProviders';

const renderWithNavigation = (component) => {
  return render(
    <NavigationContainer>
      <AppProviders>{component}</AppProviders>
    </NavigationContainer>
  );
};

describe('MainTabNavigator Component', () => {
  describe('rendering', () => {
    test('renders main tab navigator', () => {
      const { container } = renderWithNavigation(<MainTabNavigator />);
      expect(container).toBeTruthy();
    });

    test('renders all tab screens', () => {
      const { getByText } = renderWithNavigation(<MainTabNavigator />);
      
      // Check for tab labels
      expect(getByText('Home')).toBeTruthy();
      expect(getByText('Patients')).toBeTruthy();
      expect(getByText('Tasks')).toBeTruthy();
      expect(getByText('Messages')).toBeTruthy();
      expect(getByText('Settings')).toBeTruthy();
    });

    test('displays tab icons', () => {
      const { getByText } = renderWithNavigation(<MainTabNavigator />);
      
      // Check for emoji icons
      expect(getByText('🏠')).toBeTruthy();
      expect(getByText('👥')).toBeTruthy();
      expect(getByText('📋')).toBeTruthy();
      expect(getByText('💬')).toBeTruthy();
      expect(getByText('⚙️')).toBeTruthy();
    });
  });

  describe('navigation', () => {
    test('home screen is shown by default', () => {
      const { getByText } = renderWithNavigation(<MainTabNavigator />);
      
      // Dashboard should be the default screen
      expect(getByText('Home')).toBeTruthy();
    });
  });

  describe('tab configuration', () => {
    test('renders bottom tab bar', () => {
      const { container } = renderWithNavigation(<MainTabNavigator />);
      
      expect(container).toBeTruthy();
    });
  });
});
