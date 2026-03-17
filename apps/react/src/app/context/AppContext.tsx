// import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// // Interfaces to satisfy "Code Quality" and "Clean Structure"
// interface Task {
//   id: number;
//   title: string;
//   priority: string;
//   status: string;
// }

// interface AppState {
//   isLoggedIn: boolean;
//   sidebarPosition: 'left' | 'right';
//   tasks: Task[];
//   patients: any[]; // Kept as dummy array
// }

// interface AppContextType {
//   state: AppState;
//   login: () => void;
//   logout: () => void;
//   setSidebarPosition: (position: 'left' | 'right') => void;
// }

// const defaultTasks: Task[] = [
//   { id: 1, title: 'Medication Administration', priority: 'high', status: 'pending' },
//   { id: 2, title: 'Vital Signs Check', priority: 'medium', status: 'in-progress' }
// ];

// export const AppContext = createContext<AppContextType | null>(null);

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   // 1. Initialize Auth from localStorage (The "Refresh" Fix)
//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     return localStorage.getItem('isLoggedIn') === 'true';
//   });

//   // 2. Sidebar persistence (The "Responsive/UX" win)
//   const [sidebarPosition, setSidebarPositionState] = useState<'left' | 'right'>(() => {
//     return (localStorage.getItem('sidebarPosition') as 'left' | 'right') || 'left';
//   });

//   const login = useCallback(() => {
//     localStorage.setItem('isLoggedIn', 'true');
//     setIsLoggedIn(true);
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem('isLoggedIn');
//     setIsLoggedIn(false);
//   }, []);

//   const setSidebarPosition = useCallback((position: 'left' | 'right') => {
//     localStorage.setItem('sidebarPosition', position);
//     setSidebarPositionState(position);
//   }, []);

//   const contextValue = useMemo(() => ({
//     state: { 
//       isLoggedIn, 
//       sidebarPosition,
//       tasks: defaultTasks, 
//       patients: [] 
//     },
//     login,
//     logout,
//     setSidebarPosition
//   }), [isLoggedIn, sidebarPosition, login, logout, setSidebarPosition]);

//   return (
//     <AppContext.Provider value={contextValue}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (!context) throw new Error('useAppContext must be used within AppProvider');
//   return context;
// };
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// 1. Define the Settings structure to match your SettingsPage
export interface SettingsData {
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

interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
}

// 2. Add settings to the Global State interface
interface AppState {
  isLoggedIn: boolean;
  sidebarPosition: 'left' | 'right';
  tasks: Task[];
  patients: any[];
  settings: SettingsData;
}

// 3. Add updateAllSettings to the Context Type
interface AppContextType {
  state: AppState;
  login: () => void;
  logout: () => void;
  setSidebarPosition: (position: 'left' | 'right') => void;
  updateAllSettings: (newSettings: SettingsData) => void;
}

const DEFAULT_SETTINGS: SettingsData = {
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

const defaultTasks: Task[] = [
  { id: 1, title: 'Medication Administration', priority: 'high', status: 'pending' },
  { id: 2, title: 'Vital Signs Check', priority: 'medium', status: 'in-progress' }
];

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Auth Persistence
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // Settings Persistence
  const [settings, setSettings] = useState<SettingsData>(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Manual Sidebar Override (if needed outside of settings)
  const [manualSidebarPos, setManualSidebarPos] = useState<'left' | 'right' | null>(null);

  const login = useCallback(() => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  }, []);

  // Update all settings at once (called from SettingsPage)
  const updateAllSettings = useCallback((newSettings: SettingsData) => {
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
    setManualSidebarPos(null); // Reset manual override to follow settings
  }, []);

  const setSidebarPosition = useCallback((position: 'left' | 'right') => {
    setManualSidebarPos(position);
  }, []);

  // Determine sidebar position: Manual override first, then based on leftHandedMode
  const sidebarPosition = manualSidebarPos || (settings.leftHandedMode ? 'right' : 'left');

  const contextValue = useMemo(() => ({
    state: { 
      isLoggedIn, 
      sidebarPosition,
      tasks: defaultTasks, 
      patients: [],
      settings
    },
    login,
    logout,
    setSidebarPosition,
    updateAllSettings
  }), [isLoggedIn, sidebarPosition, settings, login, logout, setSidebarPosition, updateAllSettings]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};