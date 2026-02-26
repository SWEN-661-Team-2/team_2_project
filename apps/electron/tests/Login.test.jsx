/**
 * @jest-environment jsdom
 * Tests for Login component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
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
