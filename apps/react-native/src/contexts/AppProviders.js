import { createContext, useContext, useState } from 'react';
import { AppSettingsProvider, useAppSettings as useAppSettingsContext } from './AppSettingsContext';
import { AuthProvider } from './AuthContext';

/**
 * App Providers for React Native
 * Equivalent to Flutter's Provider pattern
 */

// Re-export useAppSettings from AppSettingsContext
export const useAppSettings = useAppSettingsContext;

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
  const [handednessMode, setHandednessMode] = useState('left');

  const toggleHandedness = () => {
    setIsLeftHanded(prev => !prev);
  };

  return (
    <HandednessContext.Provider value={{ 
      isLeftHanded, 
      toggleHandedness,
      handednessMode,
      setHandednessMode: (mode) => {
        setHandednessMode(mode);
        setIsLeftHanded(mode === 'left');
      },
    }}>
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
      <AuthProvider>
        <AppSettingsProvider>
          <HandednessProvider>
            {children}
          </HandednessProvider>
        </AppSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

