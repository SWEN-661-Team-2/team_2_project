/**
 * Component Tests - LoginScreen
 * Updated to match Accessibility-Hardened LoginScreen.js
 */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';
import LoginScreen from '../../src/screens/LoginScreen';
import { AppProviders } from '../../src/contexts/AppProviders';


// 1. Mock the Auth Context
jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(() => Promise.resolve({ success: true })),
    user: null,
  }),
  AuthProvider: ({ children }) => <>{children}</>,
}));

// 2. Mock the AppProviders / Handedness
jest.mock('../../src/contexts/AppProviders', () => ({
  useHandedness: () => ({
    isLeftHanded: false,
  }),
  AppProviders: ({ children }) => <>{children}</>,
}));


// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock Navigation
const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

// Simplified Render Helper - AppProviders handles AuthContext internally
const renderLoginScreen = () => {
  return render(
    <AppProviders>
      <NavigationContainer>
        <LoginScreen navigation={mockNavigation} />
      </NavigationContainer>
    </AppProviders>
  );
};

describe('LoginScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering & accessibility', () => {
    test('renders login screen with all elements and correct labels', () => {
      renderLoginScreen();

      // Check by TestID (for logic)
      expect(screen.getByTestId('login_logo')).toBeTruthy();
      expect(screen.getByTestId('login_title')).toBeTruthy();
      
      // Check by Text (for UI)
      expect(screen.getByText('CareConnect')).toBeTruthy();
      expect(screen.getByText('Sign in to your account')).toBeTruthy();

      // Check by Accessibility Label (Requirement for Assignment 6)
      expect(screen.getByLabelText('Enter your email')).toBeTruthy();
      expect(screen.getByLabelText('Enter your password')).toBeTruthy();
    });

    test('renders email and password input fields with placeholders', () => {
      renderLoginScreen();
      // Updated to match the exact placeholder in the new LoginScreen.js
      expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
    test('renders email and password input fields', () => {
      const { getByPlaceholderText } = renderLoginScreen();

      expect(getByPlaceholderText('you@example.com')).toBeTruthy();
      expect(getByPlaceholderText('password')).toBeTruthy();
    });
  });

  describe('user interactions', () => {
    test('allows email and password input', () => {
      renderLoginScreen();
      
      const emailInput = screen.getByTestId('login_email');
      const passwordInput = screen.getByTestId('login_password');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(emailInput.props.value).toBe('test@example.com');
      expect(passwordInput.props.value).toBe('password123');
    });

    test('toggles password visibility via accessibility-labeled button', () => {
      renderLoginScreen();
      const passwordInput = screen.getByTestId('login_password');
      const toggleBtn = screen.getByLabelText('Show password');

      expect(passwordInput.props.secureTextEntry).toBe(true);

      fireEvent.press(toggleBtn);
      expect(passwordInput.props.secureTextEntry).toBe(false);
      expect(screen.getByLabelText('Hide password')).toBeTruthy();
    });
  });

  describe('validation logic', () => {
    test('shows error when fields are empty', async () => {
      renderLoginScreen();
      const submitButton = screen.getByLabelText('Sign In');

      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeTruthy();
        expect(screen.getByText('Password is required')).toBeTruthy();
      });
    });

    test('clears error messages when user starts typing', async () => {
      renderLoginScreen();
      const emailInput = screen.getByTestId('login_email');
      const submitButton = screen.getByLabelText('Sign In');

      // Trigger error
      fireEvent.press(submitButton);
      expect(await screen.findByText('Email is required')).toBeTruthy();

      // Clear error
      fireEvent.changeText(emailInput, 'a');
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).toBeNull();
      });
    });
  });

  describe('security and branding', () => {
    test('security container is accessible as a single group', () => {
      renderLoginScreen();
      const securityNotice = screen.getByLabelText(/bank-level encryption/i);
      expect(securityNotice).toBeTruthy();
    });
  });
// ************************************************************
  // NEW TESTS FOR BRANCH COVERAGE: This targets the try/catch and forgot password
  // ************************************************************
  describe('Uncovered Branches', () => {
    test('calls login and handles success path', async () => {
      const loginSpy = jest.fn(() => Promise.resolve());
      useAuth.mockReturnValue({ login: loginSpy });

      renderLoginScreen();
      fireEvent.changeText(screen.getByTestId('login_email'), 'test@test.com');
      fireEvent.changeText(screen.getByTestId('login_password'), 'password');
      fireEvent.press(screen.getByLabelText('Sign In'));

      await waitFor(() => {
        expect(loginSpy).toHaveBeenCalledWith('test@test.com', 'password');
      });
    });

    test('triggers catch block on login error', async () => {
      const loginSpy = jest.fn(() => Promise.reject('Error'));
      useAuth.mockReturnValue({ login: loginSpy });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  describe('login submission', () => {
    test('calls login function on successful submission', async () => {
      const { getByTestId, getByText } = renderLoginScreen();
      const emailInput = getByTestId('login_email');
      const passwordInput = getByTestId('login_password');
      const submitButton = getByText('Sign In');

      renderLoginScreen();
      fireEvent.changeText(screen.getByTestId('login_email'), 'test@test.com');
      fireEvent.changeText(screen.getByTestId('login_password'), 'password');
      fireEvent.press(screen.getByLabelText('Sign In'));

      // Wait for async login to complete
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Login failed', 'Error');
      });
      consoleSpy.mockRestore();
    });

    test('handles forgot password click', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      renderLoginScreen();
      
      fireEvent.press(screen.getByLabelText('Forgot your password?'));
      
      expect(consoleSpy).toHaveBeenCalledWith('Forgot password clicked');
      consoleSpy.mockRestore();
        // Login is successful and doesn't show alert
        expect(Alert.alert).not.toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    test('shows alert on empty credentials', async () => {
      const { getByTestId, getByText } = renderLoginScreen();
      const emailInput = getByTestId('login_email');
      const passwordInput = getByTestId('login_password');
      const submitButton = getByText('Sign In');

      // Leave fields empty - this will trigger validation errors, not Alert
      fireEvent.press(submitButton);

      await waitFor(() => {
        // Should show validation errors, not Alert
        expect(Alert.alert).not.toHaveBeenCalled();
      }, { timeout: 1000 });
    });
  });
  // ************************************************************


   
});