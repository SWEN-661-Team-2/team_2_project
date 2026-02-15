// /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/react-native/__tests__/navigation/MainTabNavigator.test.js

/**
 * Navigation Tests - MainTabNavigator
 * Tests the main bottom tab navigation
 */
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { AppProviders } from '../../src/contexts/AppProviders';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { DashboardProvider } from '../../src/contexts/DashboardContext';
import MainTabNavigator from '../../src/navigation/MainTabNavigator';

const renderWithNavigation = (component) =>
  render(
    <AppProviders>
      <AuthProvider>
        <DashboardProvider>
          <NavigationContainer>{component}</NavigationContainer>
        </DashboardProvider>
      </AuthProvider>
    </AppProviders>
  );

describe('MainTabNavigator Component', () => {
  test('renders main tab navigator', () => {
    const { root } = renderWithNavigation(<MainTabNavigator />);
    expect(root).toBeTruthy();
  });

  test('has navigation structure', () => {
    const screen = renderWithNavigation(<MainTabNavigator />);
    expect(screen).toBeTruthy();
  });
});
