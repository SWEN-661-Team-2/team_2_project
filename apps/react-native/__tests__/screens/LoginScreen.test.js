/**
 * Component Tests - LoginScreen
 * Tests rendering, user interactions, validation, and navigation
 */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';
import LoginScreen from '../../src/screens/LoginScreen';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { AppProviders } from '../../src/contexts/AppProviders';

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

const renderLoginScreen = () => {
  return render(
    <AppProviders>
      <AuthProvider>
        <NavigationContainer>
          <LoginScreen navigation={mockNavigation} />
        </NavigationContainer>
      </AuthProvider>
    </AppProviders>
  );
};

describe('LoginScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders login screen with all elements', () => {
      const { getByTestId, getByText } = renderLoginScreen();

      expect(getByTestId('login_logo')).toBeTruthy();
      expect(getByTestId('login_title')).toBeTruthy();
      expect(getByText('CareConnect')).toBeTruthy();
      expect(getByTestId('login_email')).toBeTruthy();
      expect(getByTestId('login_password')).toBeTruthy();
    });

    test('renders email and password input fields', () => {
      const { getByPlaceholderText } = renderLoginScreen();

      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    });
  });

  describe('user interactions', () => {
    test('allows email input', () => {
      const { getByTestId } = renderLoginScreen();
      const emailInput = getByTestId('login_email');

      fireEvent.changeText(emailInput, 'test@example.com');

      expect(emailInput.props.value).toBe('test@example.com');
    });

    test('allows password input', () => {
      const { getByTestId } = renderLoginScreen();
      const passwordInput = getByTestId('login_password');

      fireEvent.changeText(passwordInput, 'password123');

      expect(passwordInput.props.value).toBe('password123');
    });

    test('password is initially hidden', () => {
      const { getByTestId } = renderLoginScreen();
      const passwordInput = getByTestId('login_password');

      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('validation', () => {
    test('shows error when email is empty', async () => {
      const { getByText, queryByText } = renderLoginScreen();
      const submitButton = getByText('Sign In');

      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(queryByText('Email is required')).toBeTruthy();
      });
    });

    test('shows error when password is empty', async () => {
      const { getByTestId, getByText, queryByText } = renderLoginScreen();
      const emailInput = getByTestId('login_email');
      const submitButton = getByText('Sign In');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(queryByText('Password is required')).toBeTruthy();
      });
    });

    test('clears email error when user types', async () => {
      const { getByTestId, getByText, queryByText } = renderLoginScreen();
      const emailInput = getByTestId('login_email');
      const submitButton = getByText('Sign In');

      // Trigger error
      fireEvent.press(submitButton);
      await waitFor(() => {
        expect(queryByText('Email is required')).toBeTruthy();
      });

      // Start typing
      fireEvent.changeText(emailInput, 't');

      await waitFor(() => {
        expect(queryByText('Email is required')).toBeFalsy();
      });
    });
  });

  describe('login submission', () => {
    test('navigates to Home on successful login', async () => {
      const { getByTestId, getByText } = renderLoginScreen();
      const emailInput = getByTestId('login_email');
      const passwordInput = getByTestId('login_password');
      const submitButton = getByText('Sign In');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockNavigation.replace).toHaveBeenCalledWith('Home');
      }, { timeout: 3000 });
    });

    test('shows alert on failed login', async () => {
      const { getByTestId, getByText } = renderLoginScreen();
      const emailInput = getByTestId('login_email');
      const passwordInput = getByTestId('login_password');
      const submitButton = getByText('Sign In');

      // Use invalid credentials
      fireEvent.changeText(emailInput, 'invalid');
      fireEvent.changeText(passwordInput, 'pw');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Login Failed',
          expect.any(String)
        );
      }, { timeout: 3000 });
    });
  });

  describe('accessibility', () => {
    test('inputs are accessible', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login_email');
      const passwordInput = getByTestId('login_password');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });
  });
});
