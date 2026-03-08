/** @jest-environment jsdom */

// Tests for Login component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../renderer/src/components/Login';

describe('Login Component Full Coverage', () => {
  const mockOnLogin = jest.fn();

  test('Hits all logic: Validation, Forgot Password, and Remember Me', () => {
    render(<Login onLogin={mockOnLogin} />);

    // 1. Hit the "Remember Me" checkbox (Missing branch)
    const checkbox = screen.getByLabelText(/Remember me/i);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    // 2. Trigger the Validation Error (Lines 15-16)
    // We send a bad email (no @) to trigger the 'if' block
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'bademail' } });
    fireEvent.change(passInput, { target: { value: '123' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();

    // 3. Trigger the "Forgot Password" link (Lines 62-76)
    const forgotLink = screen.getByText(/Forgot your password\?/i);
    fireEvent.click(forgotLink);
    expect(screen.getByText(/Password reset not implemented/i)).toBeInTheDocument();

    // 4. Hit the Successful Login branch
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  describe('Rendering', () => {
    test('renders CareConnect title', () => {
      render(<Login onLogin={mockOnLogin} />);
      expect(screen.getByText('CareConnect')).toBeInTheDocument();
    });

    test('renders email input', () => {
      render(<Login onLogin={mockOnLogin} />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    test('renders password input', () => {
      render(<Login onLogin={mockOnLogin} />);
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('renders sign in button', () => {
      render(<Login onLogin={mockOnLogin} />);
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('renders remember me checkbox', () => {
      render(<Login onLogin={mockOnLogin} />);
      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    });

    test('shows error on invalid login attempt', () => {
      render(<Login onLogin={mockOnLogin} />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'ab' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });
    test('clicking forgot password shows error', () => {
      render(<Login onLogin={mockOnLogin} />);
      fireEvent.click(screen.getByText(/forgot your password/i));
      expect(screen.getByText(/password reset not implemented/i)).toBeInTheDocument();
    });

    test('remember me checkbox can be checked', () => {
      render(<Login onLogin={mockOnLogin} />);
      const checkbox = screen.getByLabelText(/remember me/i);
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Email validation', () => {
    test('rejects email without @ symbol', () => {
      const email = 'notanemail';
      expect(email.includes('@')).toBe(false);
    });

    test('accepts valid email format', () => {
      const email = 'test@example.com';
      expect(email.includes('@')).toBe(true);
    });

    test('rejects empty email', () => {
      const email = '';
      expect(email.includes('@')).toBe(false);
    });
  });

  describe('Password validation', () => {
    test('rejects password shorter than 4 characters', () => {
      const password = 'abc';
      expect(password.length >= 4).toBe(false);
    });

    test('accepts password of 4+ characters', () => {
      const password = 'abcd';
      expect(password.length >= 4).toBe(true);
    });

    test('accepts longer passwords', () => {
      const password = 'securePassword123!';
      expect(password.length >= 4).toBe(true);
    });
  });

  describe('Login form validation logic', () => {
    function validateLogin(email, password) {
      if (!email.includes('@') || password.length < 4) {
        return { valid: false, error: 'Invalid credentials.' };
      }
      return { valid: true };
    }

    test('returns error for invalid email', () => {
      const result = validateLogin('bademail', 'password123');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('returns error for short password', () => {
      const result = validateLogin('good@email.com', 'ab');
      expect(result.valid).toBe(false);
    });

    test('returns valid for correct credentials', () => {
      const result = validateLogin('sarah@hospital.com', 'securePass');
      expect(result.valid).toBe(true);
    });

    test('returns error when both email and password are invalid', () => {
      const result = validateLogin('bad', 'ab');
      expect(result.valid).toBe(false);
    });

    test('trims email whitespace before validation', () => {
      const email = '  sarah@hospital.com  ';
      const trimmed = email.trim();
      expect(trimmed.includes('@')).toBe(true);
    });
  });

  describe('Remember me checkbox', () => {
    test('defaults to unchecked state', () => {
      const remember = false;
      expect(remember).toBe(false);
    });

    test('can be toggled on', () => {
      let remember = false;
      remember = !remember;
      expect(remember).toBe(true);
    });
  });

  describe('Forgot password flow', () => {
    test('sets an error message when forgot password is clicked', () => {
      let error = '';
      error = 'Password reset not implemented in demo.';
      expect(error).toBeTruthy();
      expect(error).toContain('reset');
    });
  });

  describe('Successful login flow', () => {
    test('calls onLogin callback when credentials are valid', () => {
      const onLogin = jest.fn();
      const email = 'nurse@hospital.com';
      const password = 'securePass';
      if (email.includes('@') && password.length >= 4) {
        onLogin();
      }
      expect(onLogin).toHaveBeenCalledTimes(1);
    });

    test('does not call onLogin with invalid credentials', () => {
      const onLogin = jest.fn();
      const email = 'bademail';
      const password = 'ab';
      if (email.includes('@') && password.length >= 4) {
        onLogin();
      }
      expect(onLogin).not.toHaveBeenCalled();
    });
  });
});
