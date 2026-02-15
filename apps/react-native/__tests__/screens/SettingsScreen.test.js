// /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/react-native/__tests__/screens/SettingsScreen.test.js

/**
 * Component Tests - SettingsScreen
 * Tests settings display and logout flow
 */
import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { AppProviders } from '../../src/contexts/AppProviders';
import { AuthProvider } from '../../src/contexts/AuthContext';
import SettingsScreen from '../../src/screens/SettingsScreen';

jest.spyOn(Alert, 'alert');

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  setOptions: jest.fn(),
};

const renderSettingsScreen = () =>
  render(
    <AppProviders>
      <AuthProvider>
        <SettingsScreen navigation={mockNavigation} />
      </AuthProvider>
    </AppProviders>
  );

describe('SettingsScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders settings screen', () => {
    const { getAllByText } = renderSettingsScreen();
    const careConnectElements = getAllByText(/CareConnect/i);
    expect(careConnectElements.length).toBeGreaterThan(0);
  });

  test('shows logout button', () => {
    const { queryByText } = renderSettingsScreen();
    const logoutButton = queryByText(/Log Out/i) || queryByText(/Logout/i);
    expect(logoutButton).toBeTruthy();
  });

  test('shows confirmation dialog on logout', () => {
    Alert.alert.mockImplementation((title, message, buttons) => {
      const action =
        buttons?.find((b) => /log out|logout/i.test(b.text)) ||
        buttons?.[0];
      action?.onPress?.();
    });

    const { queryByText } = renderSettingsScreen();
    const logoutButton = queryByText(/Log Out/i) || queryByText(/Logout/i);

    fireEvent.press(logoutButton);
    expect(Alert.alert).toHaveBeenCalled();
  });
});