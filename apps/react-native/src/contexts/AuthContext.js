import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Auth Context for React Native
 * Equivalent to Flutter's auth feature management
 * 
 * Handles authentication state, login/logout, and password management
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Login user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<boolean>} - Success status
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }

      // Simulate API call for authentication
      // In a real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock user data
      const userData = {
        id: '1',
        email: email,
        name: 'User',
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
      setCurrentUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setError(null);
  }, []);

  /**
   * Change user's password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} confirmPassword - Confirm new password
   * @returns {Promise<boolean>} - Success status
   */
  const changePassword = useCallback(async (oldPassword, newPassword, confirmPassword) => {
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!oldPassword || !newPassword || !confirmPassword) {
        throw new Error('All fields are required');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirmation must match.');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Simulate API call to change password
      await new Promise(resolve => setTimeout(resolve, 500));

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    isAuthenticated,
    currentUser,
    loading,
    error,
    login,
    logout,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
