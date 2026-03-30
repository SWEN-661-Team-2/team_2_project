import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Full settings shape — mirrors the fields managed by SettingsPage
export interface SettingsData {
  readonly theme: 'light' | 'dark';
  readonly leftHandedMode: boolean;
  readonly defaultZoom: string;
  readonly userName: string;
  readonly userRole: string;
  readonly enhancedKeyboardNav: boolean;
  readonly alwaysFocusIndicators: boolean;
  readonly highContrastMode: boolean;
  readonly reduceMotion: boolean;
  readonly taskReminders: boolean;
  readonly urgentTaskAlerts: boolean;
  readonly reminderLeadTime: string;
}

// Minimal task shape used in global state
// Full task CRUD is handled via IndexedDB in TaskManagement
interface Task {
  readonly id: number;
  readonly title: string;
  readonly priority: string;
  readonly status: string;
}

// Global application state shape
interface AppState {
  readonly isLoggedIn: boolean;
  readonly sidebarPosition: 'left' | 'right';
  readonly tasks: Task[];
  readonly patients: any[];
  readonly settings: SettingsData;
}

// Functions and state exposed through the context
interface AppContextType {
  readonly state: AppState;
  readonly login: () => void;
  readonly logout: () => void;
  readonly setSidebarPosition: (position: 'left' | 'right') => void;
  readonly updateAllSettings: (newSettings: SettingsData) => void;
}

// Default settings applied on first load before any user changes
const DEFAULT_SETTINGS: SettingsData = {
  theme: 'light',
  leftHandedMode: false,
  defaultZoom: '100%',
  userName: 'Sarah Johnson, RN',
  userRole: 'Registered Nurse',
  enhancedKeyboardNav: false,
  alwaysFocusIndicators: false,
  highContrastMode: false,
  reduceMotion: false,
  taskReminders: true,
  urgentTaskAlerts: true,
  reminderLeadTime: '15 minutes',
};

// Seed tasks for the global state — full task management is handled in IndexedDB
const defaultTasks: Task[] = [
  { id: 1, title: 'Medication Administration', priority: 'high',   status: 'pending'     },
  { id: 2, title: 'Vital Signs Check',          priority: 'medium', status: 'in-progress' },
];

// Context instance — null by default, validated in useAppContext
export const AppContext = createContext<AppContextType | null>(null);

// Props for AppProvider — children is read-only per SonarQube requirement
interface AppProviderProps {
  readonly children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // Auth state — persisted to localStorage so login survives page refresh
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // Settings state — hydrated from localStorage on first render, falls back to defaults
  const [settings, setSettings] = useState<SettingsData>(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Allows the sidebar toggle in the nav to temporarily override the leftHandedMode setting.
  // Reset to null whenever settings are saved so the toggle re-derives from leftHandedMode.
  const [manualSidebarPos, setManualSidebarPos] = useState<'left' | 'right' | null>(null);

  // Persists login flag and updates auth state
  const login = useCallback(() => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  }, []);

  // Clears login flag and returns to the login screen
  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  }, []);

  // Persists all settings to localStorage and applies them to state.
  // Clears the manual sidebar override so position follows leftHandedMode again.
  const updateAllSettings = useCallback((newSettings: SettingsData) => {
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
    setManualSidebarPos(null);
  }, []);

  // Allows the navigation toggle to override sidebar position independently of settings
  const setSidebarPosition = useCallback((position: 'left' | 'right') => {
    setManualSidebarPos(position);
  }, []);

  // Sidebar position resolution order:
  // 1. Manual override (nav toggle) if set
  // 2. Derived from leftHandedMode setting (right if left-handed, left otherwise)
  const sidebarPosition = manualSidebarPos ?? (settings.leftHandedMode ? 'right' : 'left');

  // Memoized context value — only re-creates when one of its dependencies changes
  const contextValue = useMemo(() => ({
    state: {
      isLoggedIn,
      sidebarPosition,
      tasks: defaultTasks,
      patients: [],
      settings,
    },
    login,
    logout,
    setSidebarPosition,
    updateAllSettings,
  }), [isLoggedIn, sidebarPosition, settings, login, logout, setSidebarPosition, updateAllSettings]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook — throws a descriptive error if used outside of AppProvider
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
