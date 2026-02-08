import React, { createContext, useContext, useState } from 'react';

/**
 * App Providers for React Native
 * Equivalent to Flutter's Provider pattern
 */

// Handedness Context
const HandednessContext = createContext();

export const useHandedness = () => {
  const context = useContext(HandednessContext);
  if (!context) {
    throw new Error('useHandedness must be used within HandednessProvider');
  }
  return context;
};

function HandednessProvider({ children }) {
  const [isLeftHanded, setIsLeftHanded] = useState(true);

  const toggleHandedness = () => {
    setIsLeftHanded(prev => !prev);
  };

  return (
    <HandednessContext.Provider value={{ isLeftHanded, toggleHandedness }}>
      {children}
    </HandednessContext.Provider>
  );
}

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors = {
    primary: '#2563eb',
    background: isDarkMode ? '#1f2937' : '#ffffff',
    surface: isDarkMode ? '#374151' : '#f9fafb',
    text: isDarkMode ? '#f9fafb' : '#111827',
    textSecondary: isDarkMode ? '#d1d5db' : '#6b7280',
    border: isDarkMode ? '#4b5563' : '#e5e7eb',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Combined Providers
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <HandednessProvider>
        {children}
      </HandednessProvider>
    </ThemeProvider>
  );
}
