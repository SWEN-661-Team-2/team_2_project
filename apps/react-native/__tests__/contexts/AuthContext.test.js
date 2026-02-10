/**
 * Business Logic Tests - AuthContext
 * Tests authentication logic, login, logout, and password change
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';

describe('AuthContext', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  describe('initial state', () => {
    test('starts with unauthenticated state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.currentUser).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('login', () => {
    test('successfully logs in with valid credentials', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let success;
      await act(async () => {
        success = await result.current.login('test@example.com', 'password123');
      });

      expect(success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.currentUser).toBeTruthy();
      expect(result.current.currentUser.email).toBe('test@example.com');
      expect(result.current.error).toBeNull();
    });

    test('fails login with empty email', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let success;
      await act(async () => {
        success = await result.current.login('', 'password123');
      });

      expect(success).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Email and password are required');
    });

    test('fails login with empty password', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let success;
      await act(async () => {
        success = await result.current.login('test@example.com', '');
      });

      expect(success).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Email and password are required');
    });

    test('fails login with invalid email format', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let success;
      await act(async () => {
        success = await result.current.login('invalid-email', 'password123');
      });

      expect(success).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Invalid email format');
    });

    test('sets loading state during login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login('test@example.com', 'password123');
      });

      // During async operation, loading should be true
      expect(result.current.loading).toBe(true);

      // Wait for completion
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('logout', () => {
    test('successfully logs out user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // First login
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.currentUser).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('changePassword', () => {
    test('successfully changes password with valid inputs', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let success;
      await act(async () => {
        success = await result.current.changePassword(
          'oldPassword123',
          'newPassword123',
          'newPassword123'
        );
      });

      expect(success).toBe(true);
      expect(result.current.error).toBeNull();
    });

    test('fails when old password is empty', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let success;
      await act(async () => {
        success = await result.current.changePassword(
          '',
          'newPassword123',
          'newPassword123'
        );
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('All fields are required');
    });

    test('fails when new password is empty', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let success;
      await act(async () => {
        success = await result.current.changePassword(
          'oldPassword123',
          '',
          ''
        );
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('All fields are required');
    });

    test('fails when passwords do not match', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let success;
      await act(async () => {
        success = await result.current.changePassword(
          'oldPassword123',
          'newPassword123',
          'differentPassword123'
        );
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('New password and confirmation must match.');
    });

    test('fails when new password is too short', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let success;
      await act(async () => {
        success = await result.current.changePassword(
          'oldPassword123',
          '12345',
          '12345'
        );
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('Password must be at least 6 characters');
    });
  });

  describe('error handling', () => {
    test('throws error when useAuth is used outside provider', () => {
      // Suppress console error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});
