/**
 * Component Tests - ChangePasswordScreen
 * Tests password change validation and user interactions
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ChangePasswordScreen from '../../src/screens/ChangePasswordScreen';
import { AuthProvider } from '../../src/contexts/AuthContext';

jest.spyOn(Alert, 'alert');

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

const renderChangePasswordScreen = () => {
  return render(
    <AuthProvider>
      <ChangePasswordScreen navigation={mockNavigation} />
    </AuthProvider>
  );
};

describe('ChangePasswordScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders change password title', () => {
      const { getByText } = renderChangePasswordScreen();

      expect(getByText(/Change Password/i)).toBeTruthy();
    });

    test('renders all password input fields', () => {
      const { getByPlaceholderText } = renderChangePasswordScreen();

      expect(getByPlaceholderText(/Current Password/i) || getByPlaceholderText(/Old Password/i)).toBeTruthy();
      expect(getByPlaceholderText(/New Password/i)).toBeTruthy();
      expect(getByPlaceholderText(/Confirm/i)).toBeTruthy();
    });

    test('renders submit button', () => {
      const { getByText } = renderChangePasswordScreen();

      expect(getByText(/Save/i) || getByText(/Submit/i) || getByText(/Change/i)).toBeTruthy();
    });
  });

  describe('validation', () => {
    test('shows error when passwords do not match', async () => {
      const { getByPlaceholderText, getByText } = renderChangePasswordScreen();

      const currentPassword = getByPlaceholderText(/Current Password/i) || getByPlaceholderText(/Old Password/i);
      const newPassword = getByPlaceholderText(/New Password/i);
      const confirmPassword = getByPlaceholderText(/Confirm/i);
      const submitButton = getByText(/Save/i) || getByText(/Submit/i) || getByText(/Change/i);

      fireEvent.changeText(currentPassword, 'oldPassword123');
      fireEvent.changeText(newPassword, 'newPassword123');
      fireEvent.changeText(confirmPassword, 'differentPassword');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });

    test('shows error when password is too short', async () => {
      const { getByPlaceholderText, getByText } = renderChangePasswordScreen();

      const currentPassword = getByPlaceholderText(/Current Password/i) || getByPlaceholderText(/Old Password/i);
      const newPassword = getByPlaceholderText(/New Password/i);
      const confirmPassword = getByPlaceholderText(/Confirm/i);
      const submitButton = getByText(/Save/i) || getByText(/Submit/i) || getByText(/Change/i);

      fireEvent.changeText(currentPassword, 'oldPassword123');
      fireEvent.changeText(newPassword, '12345');
      fireEvent.changeText(confirmPassword, '12345');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });
  });

  describe('successful password change', () => {
    test('shows success message on valid password change', async () => {
      const { getByPlaceholderText, getByText } = renderChangePasswordScreen();

      const currentPassword = getByPlaceholderText(/Current Password/i) || getByPlaceholderText(/Old Password/i);
      const newPassword = getByPlaceholderText(/New Password/i);
      const confirmPassword = getByPlaceholderText(/Confirm/i);
      const submitButton = getByText(/Save/i) || getByText(/Submit/i) || getByText(/Change/i);

      fireEvent.changeText(currentPassword, 'oldPassword123');
      fireEvent.changeText(newPassword, 'newPassword123');
      fireEvent.changeText(confirmPassword, 'newPassword123');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('user interactions', () => {
    test('allows input in all password fields', () => {
      const { getByPlaceholderText } = renderChangePasswordScreen();

      const currentPassword = getByPlaceholderText(/Current Password/i) || getByPlaceholderText(/Old Password/i);
      const newPassword = getByPlaceholderText(/New Password/i);
      const confirmPassword = getByPlaceholderText(/Confirm/i);

      fireEvent.changeText(currentPassword, 'test1');
      fireEvent.changeText(newPassword, 'test2');
      fireEvent.changeText(confirmPassword, 'test3');

      expect(currentPassword.props.value).toBe('test1');
      expect(newPassword.props.value).toBe('test2');
      expect(confirmPassword.props.value).toBe('test3');
    });

    test('passwords are initially hidden', () => {
      const { getByPlaceholderText } = renderChangePasswordScreen();

      const currentPassword = getByPlaceholderText(/Current Password/i) || getByPlaceholderText(/Old Password/i);
      const newPassword = getByPlaceholderText(/New Password/i);

      expect(currentPassword.props.secureTextEntry).toBe(true);
      expect(newPassword.props.secureTextEntry).toBe(true);
    });
  });
});
